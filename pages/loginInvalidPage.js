const { BASE_URL } = require('../config/env');

export class LoginInvalidPage {
  constructor(page) {
    this.page = page;
    this.baseUrl = BASE_URL;

    // Locators
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.loginModal = page.locator('#modal-login');
  }

  async goto() {
    await this.page.goto(this.baseUrl, { waitUntil: 'domcontentloaded' });
  }

  async loginInvalid(username, password) {
    await this.loginButton.click();

    const usernameInput = this.loginModal.getByPlaceholder('Enter username or email');
    const passwordInput = this.loginModal.locator('input[type="password"]');
    const submitButton = this.loginModal.getByRole('button', { name: 'Log In' });

    if (username !== undefined) await usernameInput.fill(username);
    if (password !== undefined) await passwordInput.fill(password);

    const isEnabled = await submitButton.isEnabled();

    if (isEnabled) {
      await submitButton.click();

      // ✅ allow UI validation/rendering time
      await this.page.waitForTimeout(1000);

      return 'CLICKED';
    } else {
      console.log('⚠️ Login button disabled – triggering validation');

      await usernameInput.click();
      await passwordInput.click();
      await this.page.keyboard.press('Tab');

      return 'BUTTON_DISABLED';
    }
  }

  async assertInvalidLogin() {
    const errors = [];

    const fieldErrors = this.loginModal.locator(
      '.error, .validation-error, .input-error, [role="alert"], .help-block'
    );

    // Removed password|username so it won’t match labels/links
    const generalErrors = this.loginModal.locator(
      'text=/please enter|invalid|incorrect|wrong|required|must be|not valid/i'
    );

    try {
      await Promise.race([
        fieldErrors.first().waitFor({ state: 'visible', timeout: 10000 }),
        generalErrors.first().waitFor({ state: 'visible', timeout: 10000 })
      ]);
    } catch (e) {
      console.log('⚠️ No validation message appeared within timeout');
    }

    const fieldCount = await fieldErrors.count();
    for (let i = 0; i < fieldCount; i++) {
      const text = await fieldErrors.nth(i).innerText();
      if (text?.trim()) errors.push(text.trim());
    }

    const generalCount = await generalErrors.count();
    for (let i = 0; i < generalCount; i++) {
      const text = await generalErrors.nth(i).innerText();
      if (text?.trim()) errors.push(text.trim());
    }

    return [...new Set(errors)];
  }

  async closeModal() {
    const closeButton = this.loginModal.locator(
      "//dialog[@id='modal-login']//button[@title='Close']"
    );

    if (await closeButton.isVisible()) {
      await closeButton.click();
    } else {
      await this.page.keyboard.press('Escape');
    }
  }
}
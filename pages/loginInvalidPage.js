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

  // More stable selectors
  const validationLocator = this.loginModal.locator(`
    .error,
    .validation-error,
    .input-error,
    .invalid-feedback,
    .form-error,
    .error-message,
    [role="alert"],
    .help-block,
    .text-danger
  `);

  const textValidationLocator = this.loginModal.locator(
    `text=/invalid|incorrect|required|must be|not valid|please enter|too short/i`
  );

  try {

    // Wait for either:
    // 1. validation message
    // 2. network settles
    // 3. timeout fallback

    await Promise.race([

      validationLocator.first().waitFor({
        state: 'visible',
        timeout: 15000
      }),

      textValidationLocator.first().waitFor({
        state: 'visible',
        timeout: 15000
      }),

      this.page.waitForLoadState('networkidle')

    ]);

  } catch (e) {

    console.log('⚠️ No validation message appeared within timeout');

    // Debug screenshot
    await this.page.screenshot({
      path: `test-results/no-validation-${Date.now()}.png`,
      fullPage: true
    });

    // Dump modal HTML for Jenkins debugging
    const modalHtml = await this.loginModal.innerHTML();

    console.log('===== MODAL HTML START =====');
    console.log(modalHtml);
    console.log('===== MODAL HTML END =====');
  }

  // Small stabilization wait
  await this.page.waitForTimeout(1000);

  // Capture UI validation messages
  const validationCount = await validationLocator.count();

  for (let i = 0; i < validationCount; i++) {

    const text = await validationLocator.nth(i).textContent();

    if (text?.trim()) {
      errors.push(text.trim());
    }
  }

  // Capture text-based validation messages
  const textCount = await textValidationLocator.count();

  for (let i = 0; i < textCount; i++) {

    const text = await textValidationLocator.nth(i).textContent();

    if (text?.trim()) {
      errors.push(text.trim());
    }
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
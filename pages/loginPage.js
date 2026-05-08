import { expect } from '@playwright/test';
import { BASE_URL } from '../config/env.js';

class LoginPage {

  constructor(page) {

    this.page = page;
    this.baseUrl = BASE_URL;

    // Login
    this.loginButton = page.locator("(//button[normalize-space()='Login'])[1]");
    this.loginModal = page.locator('#modal-login');

    this.usernameInput = this.loginModal.getByPlaceholder('Enter username or email');

    this.passwordInput = this.loginModal.locator(
      'input[type="password"]'
    );

    this.submitButton = this.loginModal.getByRole('button', {
      name: /log in/i
    });

    // Logged-in indicators
    this.dropdown = page.locator(
      "(//div[contains(@class,'dropdown')])[1]"
    );

    this.logoutButton = page.getByRole('button', {
      name: /log out/i
    });
  }

  // =========================
  // Navigate
  // =========================

  async goto() {

    await this.page.goto(this.baseUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    await this.page.waitForLoadState('domcontentloaded');
  }

  // =========================
  // Login
  // =========================

  async login(username, password) {

    await expect(this.loginButton).toBeVisible({
      timeout: 15000
    });

    await this.loginButton.click();

    // Wait for modal
    await expect(this.loginModal).toBeVisible({
      timeout: 15000
    });

    // Fill credentials
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);

    // Click login
    await this.submitButton.click();

    // Wait for successful login
    await Promise.race([

      this.dropdown.waitFor({
        state: 'visible',
        timeout: 30000
      }),

      this.page.locator('text=Log out').waitFor({
        state: 'visible',
        timeout: 30000
      }),

      this.page.waitForURL(/casino|sport|profile|account/i, {
        timeout: 30000
      })

    ]).catch(async () => {

      // Debug screenshot
      await this.page.screenshot({
        path: `login-failure-${Date.now()}.png`,
        fullPage: true
      });

      throw new Error('Login failed or timeout after clicking login');
    });

    // Final stable validation
    await expect(this.dropdown).toBeVisible({
      timeout: 15000
    });
  }

  // =========================
  // Logout
  // =========================
async logout() {

  try {

    // Close modal if still open
    if (await this.loginModal.isVisible().catch(() => false)) {

      const closeBtn = this.loginModal.locator(
        'button[aria-label="Close"]'
      );

      if (await closeBtn.isVisible().catch(() => false)) {
        await closeBtn.click();
      }

      await expect(this.loginModal).toBeHidden({
        timeout: 10000
      });
    }

    // Wait for dropdown button
    await expect(this.dropdownButton).toBeVisible({
      timeout: 15000
    });

    await this.dropdownButton.click();

    // Logout button
    const logoutBtn = this.page.getByRole('button', {
      name: /log out/i
    });

    await expect(logoutBtn).toBeVisible({
      timeout: 10000
    });

    await logoutBtn.click();

    // Verify logout success
    await expect(this.loginButton).toBeVisible({
      timeout: 20000
    });

    console.log('🚪 Logout successful');

  } catch (error) {

    console.log('⚠️ Logout skipped or failed');

    console.log(error.message);
  }
}
}

export { LoginPage };
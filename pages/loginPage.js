import { BASE_URL } from '../config/env.js';

class LoginPage {
  constructor(page) {
    this.page = page;
    this.baseUrl = BASE_URL;

    // Locators
    this.loginButton = page.locator("(//button[normalize-space()='Login'])[1]");
    this.usernameInput = page.getByPlaceholder("Enter username or email");

    // Modal container (fallback-safe)
    this.loginModal = page.locator('#modal-login');

    this.dropdown = page.locator("(//div[@class='dropdown dropdown-bottom group dropdown-end'])[1]");

  }

  // Navigate to base URL
  async goto() {
    
    await this.page.goto(this.baseUrl, { waitUntil: 'domcontentloaded' });
  }

  // Login method uses credentials internally
  async login(username, password) {
    await this.loginButton.click();
    const usernameInput = this.loginModal.getByPlaceholder('Enter username or email');
    const passwordInput = this.loginModal.locator('input[type="password"]');
    const submitButton = this.loginModal.getByRole('button', { name: 'Log In' });

    // 5. Actions
    await usernameInput.fill(username);
    await passwordInput.fill(password);
    await submitButton.click();
  }


  async logout() {
    await this.dropdown.click();
    const logoutButton = this.dropdown.getByRole('button', { name: 'Log out' });
    await logoutButton.click();
  }

  async logout1() {
    const logoutButton = this.dropdown.getByRole('button', { name: 'Log out' });
    await logoutButton.click();
  }

}

module.exports = { LoginPage };

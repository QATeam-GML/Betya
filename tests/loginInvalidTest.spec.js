import { test, expect } from '@playwright/test';
import { LoginInvalidPage } from '../pages/loginInvalidPage.js';
import { getInvalidCredentials } from '../utils/getInvalidCredentials.js';

test.describe('Login Validation with Invalid Credentials and Field Validations Scenarios', () => {

  const scenarios = [

  // 🔹 Invalid Credential Combinations
  { type: 'INVALID_USER', desc: 'Invalid username & valid password' },
  { type: 'INVALID_PASS', desc: 'Valid username & invalid password' },
  { type: 'INVALID_BOTH', desc: 'Invalid username & invalid password' },

  // 🔹 Empty Field Validations
  { type: 'EMPTY_CREDENTIALS', desc: 'Empty username and password' },
  { type: 'EMPTY_USERNAME', desc: 'Empty username' },
  { type: 'EMPTY_PASSWORD', desc: 'Empty password' },

  // 🔹 Password Validations
  { type: 'SHORT_PASSWORD', desc: 'Password less than 6 characters' },
  { type: 'INVALID_PASSWORD_FORMAT', desc: 'Invalid password format' },
  { type: 'LONG_PASSWORD', desc: 'Password with 100 characters' },

  // 🔹 Username / Email Validations
  { type: 'INVALID_EMAIL_FORMAT', desc: 'Invalid email format in username' },
  { type: 'USERNAME_WITH_SPACES', desc: 'Username with spaces' },
  { type: 'USERNAME_SPECIAL_CHARS', desc: 'Username with special characters' },
  { type: 'LONG_USERNAME', desc: 'Username with 100 characters' },

  // 🔹 Security / Edge Cases
  { type: 'SQL_INJECTION', desc: 'SQL injection attempt in username and password' },

];

     for (const scenario of scenarios) {

    test(`Login validation - ${scenario.type}`, async ({ page }) => {

      const loginPage = new LoginInvalidPage(page);
      const { username, password } = getInvalidCredentials(scenario.type);

      await test.step('Open site and perform invalid login', async () => {
        await loginPage.goto();
        await loginPage.loginInvalid(username, password);
      });

      let errorMessages = [];

      await test.step('Capture validation errors', async () => {
        errorMessages = await loginPage.assertInvalidLogin();
        expect.soft(errorMessages.length).toBeGreaterThan(0);
      });

      // ✅ Format output for report
      const formattedOutput = `
===== VALIDATION ERRORS =====
${errorMessages.map((msg, i) => `${i + 1}. ${msg}`).join('\n')}
============================
`;

      // ✅ Attach TEXT output to report
      await test.info().attach('Validation Errors (Text)', {
        body: formattedOutput,
        contentType: 'text/plain',
      });

      // ✅ Attach JSON output to report
      await test.info().attach('Validation Errors (JSON)', {
        body: JSON.stringify(errorMessages, null, 2),
        contentType: 'application/json',
      });

      // ✅ Attach Screenshot (very useful)
      await test.info().attach('Error Screenshot', {
        body: await page.screenshot(),
        contentType: 'image/png',
      });

      await test.step('Close modal and cleanup', async () => {
        await loginPage.closeModal();
      });

    });
  }
});
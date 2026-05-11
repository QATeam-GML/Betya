import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';
import { getRandomUnusedUser } from '../utils/randomUserPicker.js';
import { saveUsedUser } from '../utils/credentialStore.js';

// test.describe.configure({
//   mode: 'parallel'
// });

test.describe('Positive Login Test Suite', () => {
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'passed') {
      console.log(`✅ PASS: ${testInfo.title}`);
    } else {
      console.log(`❌ FAIL: ${testInfo.title}`);
      console.log(`❌ STATUS: ${testInfo.status}`);
      // Failure screenshot
      await page.screenshot({
        path: `test-results/screenshots/${testInfo.title
          .replace(/\s+/g, '-')}-${Date.now()}.png`,
        fullPage: true
      });
    }
  });

  // =====================================
  // Username Login
  // =====================================

  test('Valid login with username and password', async ({ page }) => {

    const home = new LoginPage(page);
    const user = getRandomUnusedUser();
    console.log('\n🔹 Test Start: Username Login');
    console.log(`👤 Username: ${user.username}`);
    await home.goto();
    console.log('🌐 Homepage loaded');
    await home.login(user.username, user.password);
    console.log('✅ Login successful');
    saveUsedUser(user.username);
    await page.waitForLoadState('networkidle');
    await home.logout();
    console.log('🚪 Logout successful');
  });

  // =====================================
  // Email Login
  // =====================================

  test('Valid login using email', async ({ page }) => {

    const home = new LoginPage(page);
    const user = getRandomUnusedUser();
    console.log('\n🔹 Test Start: Email Login');
    console.log(`📧 Email: ${user.email}`);
    await home.goto();
    await home.login(user.email, user.password);
    console.log('✅ Login successful using email');
    saveUsedUser(user.username);
    await home.logout();
    console.log('🚪 Logout successful');
  });

  // =====================================
  // Casino Navigation
  // =====================================

  test('Login and navigate to Casino page', async ({ page }) => {

    const home = new LoginPage(page);
    const user = getRandomUnusedUser();
    console.log('\n🔹 Test Start: Navigate to Casino Page');
    await home.goto();
    await home.login(user.username, user.password);
    await page.waitForLoadState('networkidle');
    const casinoTab = page.locator(
      "//span[@class='ml-1'][normalize-space()='Casino']"
    );
    ////span[@class='ml-1'][normalize-space()='Casino']
    await expect(casinoTab).toBeVisible({
      timeout: 15000
    });
    await casinoTab.click();
    await expect(page).toHaveURL(/casino/i);
    console.log(`🎰 Casino URL: ${page.url()}`);
    await home.logout();
  });

  // =====================================
  // Session Persistence
  // =====================================

  test('Login session persists after reload', async ({ page }) => {

    const home = new LoginPage(page);
    const user = getRandomUnusedUser();
    console.log('\n🔹 Test Start: Login session persists after reload');
    await home.goto();
    await home.login(user.username, user.password);
    await page.waitForLoadState('networkidle');
    await page.reload({
      waitUntil: 'domcontentloaded'
    });
       console.log('✅ Session persisted');
    await home.logout();
  });

  // =====================================
  // Username Display
  // =====================================

  test('Verify logged-in username is displayed', async ({ page }) => {

    const home = new LoginPage(page);
    const user = getRandomUnusedUser();
      console.log('\n🔹 Test Start: Verify logged-in username is displayed');
    await home.goto();
    await home.login(user.username, user.password);
     await page.waitForLoadState('networkidle');
    await home.dropdown.click();
    const userLabel = page.locator(`text=${user.username}`);
    await expect(userLabel).toBeVisible({
      timeout: 10000
    });

    console.log(`✅ Username visible: ${user.username}`);

    await home.logout1();
  });

  // =====================================
  // Login Performance
  // =====================================

  test('Login performance check', async ({ page }) => {

    const home = new LoginPage(page);
    const user = getRandomUnusedUser();
     console.log('\n🔹 Test Start: Login performance check');
    await home.goto();
    const start = Date.now();
    await home.login(user.username, user.password);
    const duration = Date.now() - start;
    console.log(`⏱ Login duration: ${duration}ms`);
    expect(duration).toBeLessThan(30000);

    await home.logout();
  });

});
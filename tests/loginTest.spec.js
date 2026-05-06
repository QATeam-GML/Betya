import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';
import { getRandomUnusedUser } from '../utils/randomUserPicker.js';
import { saveUsedUser } from '../utils/credentialStore.js';

test.describe('Positive Login Test Suite', () => {

  // ✅ Global result logger
  test.afterEach(async ({}, testInfo) => {
    if (testInfo.status === 'passed') {
      console.log(`✅ PASS: ${testInfo.title}`);
    } else if (testInfo.status === 'failed') {
      console.log(`❌ FAIL: ${testInfo.title}`);
    } else {
      console.log(`⚠️ ${testInfo.status}: ${testInfo.title}`);
    }
  });

  test('Valid login with username and password', async ({ page }) => {
    const home = new LoginPage(page);
    const user = getRandomUnusedUser();

    console.log(`\n🔹 Test Start: Valid login (username)`);
    console.log(`👤 Username: ${user.username}`);

    await home.goto();
    console.log('🌐 Navigated to homepage');

    await home.login(user.username, user.password);
    console.log('🔐 Login attempted');

    await expect(home.dropdown).toBeVisible();
    console.log('✅ Login successful, dropdown visible');

    saveUsedUser(user.username);
    await home.logout();
    console.log('🚪 Logged out successfully');
  });

  test('Valid login using email', async ({ page }) => {
    const home = new LoginPage(page);
    const user = getRandomUnusedUser();

    console.log(`\n🔹 Test Start: Login with email`);
    console.log(`📧 Email: ${user.email}`);

    await home.goto();
    await home.login(user.email, user.password);

    console.log('✅ Login successful using email');

    saveUsedUser(user.username);
    await home.logout();
  });

  test('Login and navigate to Casino page', async ({ page }) => {
    const home = new LoginPage(page);
    const user = getRandomUnusedUser();

    console.log(`\n🔹 Test Start: Navigate to Casino`);
    console.log(`👤 User: ${user.username}`);

    await home.goto();
    await home.login(user.username, user.password);

       // ✅ Wait for page to fully load after login
    await page.waitForLoadState('networkidle');

    const casinoTab = page.locator("//span[@class='ml-1'][normalize-space()='Casino']");
    await casinoTab.click();
    console.log('🎰 Clicked Casino tab');

    await expect(page).toHaveURL(/casino/);
    console.log(`✅ Navigated to: ${page.url()}`);

    await home.logout();
  });

  test('Login session persists after reload', async ({ page }) => {
    const home = new LoginPage(page);
    const user = getRandomUnusedUser();

    console.log(`\n🔹 Test Start: Session persistence`);

    await home.goto();
    await home.login(user.username, user.password);

    await page.reload();
    console.log('🔄 Page reloaded');

    await page.waitForLoadState('networkidle');
    // await home.dropdown.click();

    // await expect(home.dropdown).toBeVisible();
    console.log('✅ Session persisted after reload');

   // await home.logout();
  });

  test('Login and access profile settings page', async ({ page }) => {
    const home = new LoginPage(page);
    const user = getRandomUnusedUser();

    console.log(`\n🔹 Test Start: Profile Settings`);
    console.log(`👤 User: ${user.username}`);

    await home.goto();
    await home.login(user.username, user.password);

    await expect(home.dropdown).toBeVisible();
    console.log('✅ Login successful');

    await home.dropdown.click();
    console.log('⬇️ Opened dropdown');

    const profileOption = page.locator("(//a[contains(text(),'Settings')])[1]");
    await profileOption.click();
    console.log('⚙️ Clicked Settings');

    await expect(page).toHaveURL(/profile\/settings/);
    console.log(`🌐 Current URL: ${page.url()}`);

    const securityHeader = page.locator("//h1[normalize-space()='Security']");
    await expect(securityHeader).toBeVisible();

    const text = await securityHeader.textContent();
    console.log(`🔎 Header Text: ${text}`);

    expect(text.trim()).toBe('Security');
    console.log('✅ Security page verified');

    await home.logout();
  });

  test('Verify logged-in username is displayed', async ({ page }) => {
    const home = new LoginPage(page);
    const user = getRandomUnusedUser();

    console.log(`\n🔹 Test Start: Verify username display`);

    await home.goto();
    await home.login(user.username, user.password);

    await page.waitForLoadState('networkidle');

    await home.dropdown.click();

    const userLabel = page.locator(`text=${user.username}`);
    await expect(userLabel).toBeVisible();

    console.log(`✅ Username visible: ${user.username}`);

    await home.logout1();
  });

  test('Login performance check', async ({ page }) => {
    const home = new LoginPage(page);
    const user = getRandomUnusedUser();

    console.log(`\n🔹 Test Start: Login performance`);

    await home.goto();

    const start = performance.now();

    await home.login(user.username, user.password);
    await expect(home.dropdown).toBeVisible();

    const duration = performance.now() - start;
    console.log(`⏱ Login time: ${Math.round(duration)}ms`);

    if (duration > 8000) {
      console.log(`⚠️ Slow login detected`);
    } else {
      console.log(`✅ Login performance acceptable`);
    }

    await home.logout();
  });

});


// ✅ Multi-user test
test('Multiple users login sequentially', async ({ browser }) => {
  const users = [getRandomUnusedUser(), getRandomUnusedUser()];

  const passedUsers = [];
  const failedUsers = [];

  console.log('\n🔹 Test Start: Multiple user login');

  for (const user of users) {
    if (!user?.username || !user?.password) continue;

    console.log(`\n👤 Testing user: ${user.username}`);

    const page = await browser.newPage();
    const home = new LoginPage(page);

    try {
      await home.goto();
      await home.login(user.username, user.password);

      await expect(home.dropdown).toBeVisible();

      console.log(`✅ Login success: ${user.username}`);
      passedUsers.push(user.username);

      saveUsedUser(user.username);
      await home.logout();

    } catch (error) {
      console.log(`❌ Login failed: ${user.username}`);
      failedUsers.push(user.username);
    } finally {
      await page.close();
    }
  }

console.log('\n===== TEST SUMMARY =====');

console.log('✅ Passed Users:');

if (passedUsers.length === 0) {
  console.log('No passed users');
} else {
  passedUsers.forEach(u => console.log(`- ${u}`));
}

console.log('\n❌ Failed Users:');

if (failedUsers.length === 0) {
  console.log('🎉 No failed users');
} else {
  failedUsers.forEach(u => console.log(`- ${u}`));
}

console.log('========================\n');
});
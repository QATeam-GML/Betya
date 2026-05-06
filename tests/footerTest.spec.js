//This test audits the casino footer by navigating to the bottom of the page, scrolling to the footer, verifying all 
//required elements, and ensuring no validation failures occurred.

import { test } from "@playwright/test";
import { FooterPage } from "../pages/footerPage.js";

test("Casino Footer Compliance Audit", async ({ page }) => {
  const footer = new FooterPage(page);

  await footer.goto();
  
  await footer.scrollToFooter();

  await footer.verifyFooterLogo();   // ✅ Logo
  await footer.verifySocialIcons();
  await footer.verifyHelpLinks();
  await footer.verifyTermsLinks();
  await footer.verifyAgeNotice();    // ✅ Age notice
  await footer.verifyAgeIcon();      // ✅ 18+ icon
  await footer.verifyPaymentMethods();
  await footer.verifyAllRightsRes(); // ✅ Copyright
  
  await footer.assertNoFailures();
});

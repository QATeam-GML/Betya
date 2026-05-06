// footerPage.js
import { BASE_URL } from "../config/env.js";
import { FOOTER_EXPECTED } from "../utils/footerExpected.js";

const EXPECTED = FOOTER_EXPECTED; // Alias for cleaner access

class FooterPage {
    constructor(page) {
        this.page = page;
        this.baseUrl = BASE_URL;
        this.failures = [];

        //Logo
        this.footerLogo = page.locator("(//img[@alt='Betja Logo'])[1]");

        // Social icons
        this.socialIcons = {
            //Discord: page.locator("(//img[@alt='Discord'])[1]"),
            Telegram: page.locator("(//img[@alt='Telegram'])[1]"),
            Instagram: page.locator("(//img[@alt='Instagram'])[1]"),
            YouTube: page.locator("(//img[@alt='YouTube'])[1]"),
            Twitter: page.locator("(//img[@alt='Twitter'])[1]")
        };

        // Help links
        this.helpLinks = {
            Support: page.locator("(//h6[normalize-space()='Help and Support'])[1]"),
            "Contact Us": page.locator("(//a[normalize-space()='Contact Us'])[1]"),
            FAQs: page.locator("(//a[normalize-space()='FAQs'])[1]")
        };

        // Terms links
        this.termsLinks = {
            "General Terms and Conditions": page.locator("(//a[normalize-space()='General Terms and Conditions'])[1]"),
            //"Sportbook Rules": page.locator("(//a[normalize-space()='Sportbook Rules'])[1]"),
            "Promotions Terms": page.locator("(//a[normalize-space()='Promotions Terms'])[1]"),
            "Privacy Policy": page.locator("(//a[normalize-space()='Privacy Policy'])[1]"),
            "Cookie Policy": page.locator("(//a[normalize-space()='Cookie Policy'])[1]"),
            "Responsible Gaming": page.locator("(//a[normalize-space()='Responsible Gaming'])[1]")
        };

        // Age notice
        this.ageNotice = page.locator("(//div[@class='footer-nav footer-age-restricted'])[1]");

        // Age icon 18+
        this.ageIcon = page.locator("(//img[@alt='Age Restricted'])[1]");

        // Payment methods
        this.paymentMethods = {
            "Bank Transfer": page.locator("(//img[@alt='Bank Transfer'])[1]"),
            Bitcoin: page.locator("(//img[@alt='Bitcoin'])[1]"),
            "Cash to Code": page.locator("(//img[@alt='Cash to Code'])[1]"),
            Ethereum: page.locator("(//img[@alt='Ethereum Coin'])[1]"),
            Litecoin: page.locator("(//img[@alt='Lite Coin'])[1]"),
            Tether: page.locator("(//img[@alt='Tether Coin'])[1]"),
            NeoSurf: page.locator("(//img[@alt='NeoSurf'])[1]"),
            Visa: page.locator("(//img[@alt='Visa'])[1]"),
            Mastercard: page.locator("(//img[@alt='Master Card'])[1]")
        };

        // All rights
        this.allRR = page.locator("span:has-text('All rights reserved')");

    }

    async goto() {
        await this.page.goto(this.baseUrl, { waitUntil: 'domcontentloaded' });
    }

    async scrollToFooter() {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await this.page.waitForTimeout(5000);
    }

    // ================= SMART SAFE CHECK =================
    async safeCheck(name, locator, options = {}) {
        try {
            const count = await locator.count();

            if (count === 0) {
                console.log(`⚠️ ${name} not found`);
                return false;
            }

            const el = locator.first();
            const visible = await el.isVisible();

            let value = "";

            if (options.type === "text") {
                value = (await el.textContent())?.trim();
            } else if (options.type === "alt") {
                value = await el.getAttribute("alt");
            } else if (options.type === "href") {
                value = await el.getAttribute("href");
            }

            console.log(
                `${visible ? "✅" : "⚠️"} ${name}` +
                (value ? ` → ${value}` : "")
            );

            return visible;

        } catch (e) {
            console.log(`⚠️ ${name} error`);
            return false;
        }
    }

    // ================= CRITICAL CHECKS =================
    async verifyFooterLogo() {
        const ok = await this.safeCheck("Footer Logo", this.footerLogo, { type: "alt" });
        if (!ok) this.failures.push("Footer logo missing");
    }

    async verifyAgeNotice() {
        const ok = await this.safeCheck("Age Notice", this.ageNotice, { type: "text" });

        if (!ok) {
            this.failures.push("Age notice missing");
            return;
        }

        const text = await this.ageNotice.textContent();

        if (!text?.includes("under the age of 18")) {
            this.failures.push("Age notice invalid");
        }
    }

    async verifyAgeIcon() {
        const ok = await this.safeCheck("Age Icon", this.ageIcon, { type: "alt" });
        if (!ok) this.failures.push("Age icon missing");
    }

    async verifyAllRightsRes() {
        const ok = await this.safeCheck("Copyright", this.allRR, { type: "text" });

        if (!ok) {
            this.failures.push("Copyright missing");
            return;
        }

        const text = await this.allRR.textContent();

        if (!text?.includes("All rights reserved")) {
            this.failures.push("Copyright mismatch");
        }
    }

    // ================= NON-CRITICAL =================
    async verifySocialIcons() {
        for (const key in this.socialIcons) {
            await this.safeCheck(`Social - ${key}`, this.socialIcons[key], { type: "alt" });
        }
    }

    async verifyPaymentMethods() {
        for (const key in this.paymentMethods) {
            await this.safeCheck(`Payment - ${key}`, this.paymentMethods[key], { type: "alt" });
        }
    }

    // ================= HELP LINKS =================
    async verifyHelpLinks() {
        for (const key in this.helpLinks) {
            const ok = await this.safeCheck(
                `Help - ${key}`,
                this.helpLinks[key],
                { type: "href" }
            );

            if (!ok) this.failures.push(`Help link missing: ${key}`);
        }
    }

    // ================= TERMS LINKS =================
    async verifyTermsLinks() {
        for (const key in this.termsLinks) {
            const ok = await this.safeCheck(
                `Terms - ${key}`,
                this.termsLinks[key],
                { type: "href" }
            );

            if (!ok) this.failures.push(`Terms link missing: ${key}`);
        }
    }

    // ================= FINAL ASSERT =================
    async assertNoFailures() {
        console.log("\n🚦 FINAL FOOTER STATUS:");

        if (this.failures.length > 0) {
            console.error("\n❌ FAILURES:");
            this.failures.forEach(f => console.error(" - " + f));

            throw new Error(
                `Footer validation failed (${this.failures.length} issues): ` +
                this.failures.join(", ")
            );
        }

        console.log("\n✅ FOOTER VALIDATION PASSED");
    }
}

export { FooterPage };
import { launch } from 'puppeteer';
import fs from 'fs';
import { Parser } from 'json2csv';

const target = 'https://schaffermortgage.zipforhome.com/CompanySite/LoanOfficers';

async function scrapeAllPages() {
    console.log("🚀 Launching browser...");
    const browser = await launch({ headless: false });

    const [page] = await browser.pages();

    try {
        await page.goto(target, { waitUntil: "domcontentloaded", timeout: 60000 });

        // Wait for elements to load
        await page.waitForSelector(".lo-contact", { timeout: 30000 });

        // Extract loan officer details
        const loanOfficers = await page.evaluate(() => {
            let data = [];
            document.querySelectorAll(".lo-contact").forEach(lo => {
                const name = lo.querySelector(".name a")?.innerText.trim() || "N/A";

                // Extracting phone, email, and NMLS by looking at labels
                const details = Array.from(lo.querySelectorAll("dd"));
                let phone = "N/A";
                let email = "N/A";
                let nmls = "N/A";

                for (let i = 0; i < details.length; i++) {
                    if (details[i].classList.contains("lo-title")) {
                        const title = details[i].innerText.trim();
                        const value = details[i + 1]?.innerText.trim() || "N/A";

                        if (title.includes("Phone")) phone = value;
                        if (title.includes("Email")) email = value;
                        if (title.includes("NMLS")) nmls = value;
                    }
                }

                data.push({ name, phone, email, nmls });
            });
            return data;
        });

        // Save data to CSV using json2csv
        saveToCSV(loanOfficers, 'loan_officers.csv');

    } catch (error) {
        console.error(`❌ Error scraping ${target}:`, error);
    } finally {
        await browser.close();
    }
}

// Function to save data as CSV
function saveToCSV(data, filename) {
    try {
        const parser = new Parser();
        const csv = parser.parse(data);

        fs.writeFileSync(filename, csv, 'utf8');
        console.log(`📁 Data saved to ${filename}`);
    } catch (error) {
        console.error("❌ Error converting JSON to CSV:", error);
    }
}

// Run the script
scrapeAllPages();

import 'dotenv/config';
import { launch } from 'puppeteer'
import Captcha from '2captcha-ts';
import { readFileSync, writeFileSync } from 'fs';
import { parse } from 'json2csv';

// Checking for APIKEY in .env
if (!process.env.APIKEY) {
    console.error("APIKEY is not defined in .env file");
    process.exit(1); // Terminate execution if key not found
}

const solver = new Captcha.Solver(process.env.APIKEY);
const target = 'https://www.coast2coastmortgage.com/staff-roster?page='

async function scrapeAllPages() {
    console.log("Launching browser...");
    const browser = await launch({
        headless: false
    })

    const [page] = await browser.pages()

    const preloadFile = readFileSync('./inject.js', 'utf8')
    await page.evaluateOnNewDocument(preloadFile)

    // Here we intercept the console messages to catch the message logged by inject.js script
    page.on('console', async (msg) => {
        const txt = msg.text()
        if (txt.includes('intercepted-params:')) {
            const params = JSON.parse(txt.replace('intercepted-params:', ''))

            const wafParams = {
                pageurl: target,
                sitekey: params.key,
                iv: params.iv,
                context: params.context,
                challenge_script: params.challenge_script,
                captcha_script: params.captcha_script
            }

            try {
                console.log('Solving the captcha...')
                const res = await solver.amazonWaf(wafParams)
                console.log('Using the token...')
                await page.evaluate(async (token) => {
                    await ChallengeScript.submitCaptcha(token);
                    window.location.reload()
                }, res.data.captcha_voucher);



                let allStaff = [];

                for (let i = 0; i <= 11; i++) {
                    let url = `${target}${i}`;
                    console.log(`Scraping Page ${i}: ${url}`);
                    const staff = await scrapePage(page, url);
                    allStaff = allStaff.concat(staff);
                }

                // Save the scraped data to CSV
                saveToCSV(allStaff);

                console.log("✅ Data successfully saved to staff_data.csv");
                await browser.close();

            } catch (e) {
                // console.log(e)
            }
        } else {
            return
        }
    })

    await page.goto(target)




}

// Function to scrape a single page
async function scrapePage(page, url) {
    try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

        // Wait for the main content to load (adjust selector based on the website structure)
        await page.waitForSelector(".row.mb-3", { timeout: 30000 });

        return await page.evaluate(() => {
            let data = [];

            document.querySelectorAll(".row.mb-3").forEach(staff => {
                const name = staff.querySelector("h5 a")?.innerText.trim() || "N/A";
                const phone = staff.querySelector("a[href^='tel']")?.innerText.trim() || "N/A";
                const email = staff.querySelector("a[href^='mailto']")?.getAttribute("href").replace("mailto:", "").trim() || "N/A";
                const nmls = Array.from(staff.querySelectorAll("label"))
                    .find(label => label.innerText.includes("NMLS:"))?.innerText.replace("NMLS: ", "") || "N/A";

                data.push({ name, phone, email, nmls });
            });
            return data;
        });
    } catch (error) {
        // console.error(`❌ Error scraping ${url}:`, error);
        return [];
    }
}

// Function to save data to CSV
function saveToCSV(data) {
    const csvFields = ['name', 'phone', 'email', 'nmls'];
    const csv = parse(data, { fields: csvFields });

    // Save data to a CSV file
    writeFileSync('staff_data.csv', csv, 'utf8');
}

// Run the script
scrapeAllPages();

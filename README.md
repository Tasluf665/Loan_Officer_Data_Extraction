# 🚀 Automated Loan Officer Data Extraction from Finance Websites 🏦

This project demonstrates how to scrape loan officer contact details from finance websites using **Puppeteer** and **2Captcha**. The scraper automates data extraction from dynamically rendered web pages, bypasses captchas, and saves structured data in various formats.

## 📌 Extracted Data:
- ✅ **Full Name**
- ✅ **Phone Number**
- ✅ **Email Address**
- ✅ **NMLS ID** (if available)

## 🔹 Reference Websites:
- 🔗 Coast2Coast Mortgage
- 🔗 Schaffer Mortgage

## ✨ Key Features:
- ✅ **JavaScript Handling**: Extracts data from dynamic, JavaScript-rendered pages.
- ✅ **Captcha Solving**: Uses **2Captcha API** to bypass bot protection.
- ✅ **Pagination Handling**: Automatically navigates through multiple subpages.
- ✅ **Data Export**: Saves extracted data in **CSV, Excel, and JSON** formats.

## 💡 Technologies Used:
- 🔹 **Puppeteer** - Web automation and data extraction.
- 🔹 **Node.js** - JavaScript runtime for executing the scraper.
- 🔹 **2Captcha API** - Bypasses WAF captchas to access protected data.
- 🔹 **JSON2CSV** - Converts extracted data into structured formats.

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Tasluf665/Loan-Officer-Data-Scraper.git
cd Loan-Officer-Data-Scraper
npm install
```

## 🔑 Configure API Keys
Before running the scraper, set up your **2Captcha API key**:

1️⃣ **Create a `.env` file** in the project root directory.  
2️⃣ **Add the following line** inside the `.env` file:

```ini
CAPTCHA_API_KEY=your_2captcha_api_key
```

## Run the Scraper
To start scraping loan officer data, follow these steps:

1️⃣ **Execute the script** by running the following command:

```bash
node scrape.js
```

## Contact

If you have any questions or suggestions, feel free to reach out!

- LinkedIn: [Md Tasluf Morshed](https://www.linkedin.com/in/md-tasluf-morshed/)
- GitHub: [Tasluf665](https://github.com/Tasluf665)
- Personal Website: [Tasluf Portfolio](https://tasluf665.github.io/portfolio-/index.html)
- YouTube Video: [Extract Contact Info from Finance Websites Using Puppeteer & 2Captcha](https://www.youtube.com/watch?v=XAMLk39-cdo)





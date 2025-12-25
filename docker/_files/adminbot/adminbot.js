const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs")
const app = express();
const PORT = process.env.PORT || 4000;

const FLAG = fs.readFileSync("/flag", 'utf8') || "flag{test_flag}";
// const FLAG = "flag{test_flag}"
const BASE_URL = "http://127.0.0.1:3000/";

const visit = async (template, token) => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });

        const url = `${BASE_URL}render?template=${encodeURIComponent(template)}&token=${encodeURIComponent(token)}`;
        console.log(url)
        let page = await browser.newPage();
        await page.goto(url, { timeout: 1500 });

        await page.close();
        page = null;

        await browser.close();
    } catch (err) {
        console.error(err);
    } finally {
        if (browser) await browser.close();
    }
};

app.get("/visit", async (req, res) => {
    const { template} = req.query;
    console.log(template)
    if (!template) {
        return res.status(400).send("Invalid parameters");
    }

    try {
        await visit(template, FLAG);
        res.status(200).send("Visit complete");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
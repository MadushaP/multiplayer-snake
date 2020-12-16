
const puppeteer = require('puppeteer');

describe('snake', () => {
    test('simulate single player game', async () => {
        const browser = await puppeteer.launch({ headless: false, args: ['--window-size=1920,1080'], defaultViewport: null });
        const page = await browser.newPage();
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });

        console.log("Selecting single player")
        await page.hover('div[title="Single player"]');
        await page.waitForTimeout(1500);
        await page.click('div[title="Single player"]');
        await page.waitForTimeout(1000);
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(1000);
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(1000);
        await page.keyboard.press('ArrowUp');
        await page.waitForTimeout(1000);
        await page.keyboard.press('ArrowLeft');

        console.log("Switching on ai")
        await page.click('div[title="ai"]');
        await page.waitForTimeout(2000);

        console.log("Switching off sound")
        let soundToggle = '#root > div > div > div:nth-child(2) > div > div.settingContainer > div > div:nth-child(3) > div'
        await page.click(soundToggle)
        await page.waitForTimeout(2000);
        console.log("Switching on sound")
        await page.click(soundToggle);

        await page.waitForTimeout(2000);

        console.log("Switching on acronym")
        let acronymToggle = '#root > div > div > div:nth-child(2) > div > div.settingContainer > div > div:nth-child(4) > div'
        await page.click(acronymToggle);
        await page.waitForTimeout(2000);
        console.log("Switching off acronym")
        await page.click(acronymToggle);

        await page.waitForTimeout(2000);

        console.log("Switching on pause")
        await page.click('div[title="pause"]');
        await page.waitForTimeout(2000);
        console.log("Switching off pause")
        await page.click('div[title="pause"]');

        await page.waitForTimeout(2000);

        console.log("Switching off ai")
        await page.click('div[title="ai"]');
        console.log("Killing snake")

        await page.waitForTimeout(3500);
        console.log("Clicking restart")
        await page.click('img[title="restartIcon"]');
        await page.waitForTimeout(2000);

        console.log("Killing snake")
        await page.keyboard.press('ArrowUp');
        await page.waitForTimeout(2000);
        console.log("Go back to main menu")
        await page.click('img[title="backIcon"]');
        await page.waitForTimeout(2000);

        await browser.close();
    }, 50000)

})
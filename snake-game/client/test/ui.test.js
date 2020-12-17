
const puppeteer = require('puppeteer');

describe('snake', () => {
    let page
    let browser
    beforeEach(async () => {
         browser = await puppeteer.launch({ headless: false, args: ['--window-size=1920,1080'], defaultViewport: null });
         page = await browser.newPage();
         await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
    });

      
    xtest('simulate single player game', async () => {
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
        await page.waitForTimeout(1000);

        console.log("Switching off sound")
        let soundToggle = '#root > div > div > div:nth-child(2) > div > div.settingContainer > div > div:nth-child(3) > div'
        await page.click(soundToggle)
        await page.waitForTimeout(1000);
        console.log("Switching on sound")
        await page.click(soundToggle);

        await page.waitForTimeout(1000);

        console.log("Switching on acronym")
        let acronymToggle = '#root > div > div > div:nth-child(2) > div > div.settingContainer > div > div:nth-child(4) > div'
        await page.click(acronymToggle);
        await page.waitForTimeout(1000);
        console.log("Switching off acronym")
        await page.click(acronymToggle);

        await page.waitForTimeout(1000);

        console.log("Switching on pause")
        await page.click('div[title="pause"]');
        await page.waitForTimeout(1000);
        console.log("Switching off pause")
        await page.click('div[title="pause"]');

        await page.waitForTimeout(1000);

        console.log("Switching off ai")
        await page.click('div[title="ai"]');
        console.log("Killing snake")

        await page.waitForTimeout(3500);
        console.log("Clicking restart")
        await page.click('img[title="restartIcon"]');
        await page.waitForTimeout(1000);

        console.log("Killing snake")
        await page.keyboard.press('ArrowUp');
        await page.waitForTimeout(1000);
        console.log("Go back to main menu")
        await page.click('img[title="backIcon"]');
        await page.waitForTimeout(1000);

        await browser.close();
    }, 50000)

    test('settings menu', async () => {
        await page.hover('img[title="menuSettings"]');
        await page.waitForTimeout(1000);

        let soundToggle = 'body > div.ReactModalPortal > div > div > div.menuSettings > div > div > div > div > div.rpt-textbox-container > div.rpt-textbox > div > span:nth-child(2) > div:nth-child(2)'
        await page.click(soundToggle);
        await page.waitForTimeout(500);
        await page.click(soundToggle);
        
        await page.waitForTimeout(500);
        await page.click('body > div.ReactModalPortal > div > div > div.menuSettings > div > div > div > div > div.rpt-textbox-container > div.rpt-textbox > div > span:nth-child(3) > div > div:nth-child(2)')
        await page.waitForTimeout(500);
        await page.click('body > div.ReactModalPortal > div > div > div.menuSettings > div > div > div > div > div.rpt-textbox-container > div.rpt-textbox > div > span:nth-child(3) > div > div:nth-child(2)')
        await page.waitForTimeout(500);
        await page.click('body > div.ReactModalPortal > div > div > div.menuSettings > div > div > div > div > div.rpt-textbox-container > div.rpt-textbox > div > span:nth-child(3) > div > div:nth-child(2)')
        await page.waitForTimeout(500);

        await page.click('body > div.ReactModalPortal > div > div > div.menuSettings > div > div > div > div > div.rpt-textbox-container > div.rpt-textbox > div > span.subSettingText.subSettingShadow > fieldset > div > label:nth-child(2) > span.MuiButtonBase-root.MuiIconButton-root.PrivateSwitchBase-root-1.MuiRadio-root.MuiRadio-colorSecondary.MuiIconButton-colorSecondary > span.MuiIconButton-label > input')
        await page.waitForTimeout(1000);
        await page.click(' body > div.ReactModalPortal > div > div > div.menuSettings > div > div > div > div > div.rpt-textbox-container > div.rpt-textbox > div > span.subSettingText.subSettingShadow > fieldset > div > label:nth-child(1) > span.MuiButtonBase-root.MuiIconButton-root.PrivateSwitchBase-root-1.MuiRadio-root.MuiRadio-colorSecondary.MuiIconButton-colorSecondary > span.MuiIconButton-label > input')
        await page.waitForTimeout(1000);

        await page.click('div[title="Single player"]');
        await page.waitForTimeout(2000);
        await browser.close();

    }, 50000)


    xtest('simulate multiplayer player game', async () => {
        browser2 = await puppeteer.launch({ headless: false, args: ['--window-size=1920,1080'], defaultViewport: null });
        page2 = await browser2.newPage();
        await page2.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });

        await page.click('div[title="Multiplayer"]');

        await page.waitForTimeout(1000);
        await page2.click('div[title="Multiplayer"]');
        await page.waitForTimeout(1000);

        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(500);

        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(500);
        await page2.keyboard.press('ArrowUp');
        await page.waitForTimeout(500);
        await page2.keyboard.press('ArrowLeft');
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(500);
        await page2.keyboard.press('ArrowDown');

        await page.waitForTimeout(1500);
        await browser.close();
        await browser2.close();
    }, 50000)

})
const { expect, should } = require('chai');
const { Builder, By, until, Key, WebElement } = require('selenium-webdriver');
const assert = require('chai').assert;

class Base {
    constructor(driver) {
        this.driver = driver;
    }

    async clickElement(locator) {
        await this.driver.findElement(locator).click();
    }

    async focusElement(locator){
        const element = await this.driver.findElement(locator);
        await this.driver.executeScript('arguments[0].focus();', element);
        // console.log(element);
    }

    async enterText(locator, text) {
        await this.focusElement(locator);
        await this.driver.findElement(locator).sendKeys(text, Key.ENTER);
    }
}

class searchAnything extends Base{
    constructor(driver){
        super(driver);
        this.searchBox=By.xpath('//textarea[@title="Search"]');
        this.resultItem=By.xpath('//a//h3[contains(text(),"Selenium")]');
        this.headline=By.xpath('//h1');
    }
    
    async searchFunction(searchItem,searchText){
        await this.driver.wait(until.elementsLocated(this.searchBox));
        await this.enterText(this.searchBox,searchItem);
        await this.driver.wait(until.elementsLocated(this.resultItem));
        await this.clickElement(this.resultItem);
        await this.driver.wait(until.elementsLocated(this.headline));
        const text= await (this.driver.findElement(this.headline)).getText();
        expect(text).to.equal(searchText);
    }

}

describe('Test Suite', () => {
    let driver;
    let search;
    const baseUrl = 'https://www.google.com/';

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        search = new searchAnything(driver);
    });

    it('Test Case - Search Selenium and validate the opening title', async () => {
        await driver.get(baseUrl);
        await search.searchFunction("Selenium","Selenium automates browsers. That's it!");
    });

    after(async () => {
        await driver.quit();
    });
})

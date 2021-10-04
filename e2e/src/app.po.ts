import {browser, by, element, ElementArrayFinder, ElementFinder, ExpectedConditions} from 'protractor';

export class AppPage {
  constructor() {
    browser.driver.manage().window().setSize(1440, 900).then(() => {
      console.log('Browser window resized.');
      browser.driver.executeScript(() => {
        return {width: window.innerWidth, height: window.innerHeight};
      }).then(dimensions => {
        console.log('window dimensions', dimensions);
      })
    });
  }

  waitForAngularEnabled(enabled: boolean) {
    return browser.waitForAngularEnabled(enabled);
  }

  refresh() {
    return browser.refresh();
  }

  async refreshAndRedirectToReturnUrl() {
    const previousRoute = await this.getRoute();
    await this.waitFor(1000);
    await this.refresh();
    await this.waitFor(1000);
    expect(await this.getRoute()).toEqual(previousRoute);
  }

  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  async clickAndExpectRoute(clickSelector: string, expectedRoute: string | RegExp) {
    await this.waitForClickable(clickSelector);
    await this.clickElement(clickSelector);
    if (typeof expectedRoute === 'string') {
      expect(this.getRoute()).toEqual(expectedRoute);
    } else {
      expect(this.getRoute()).toMatch(expectedRoute);
    }
  }

  async clickElement(selector: string) {
    await this.waitForClickable(selector);
    await this.scrollTo(selector);
    await this.focus(selector);
    return this.getElement(selector).click();
  }

  closeTab() {
    return browser.close();
  }

  focus(selector: string) {
    return browser.controlFlow().execute(() => {
      return browser.executeScript('arguments[0].focus()', this.getElement(selector).getWebElement());
    });
  }

  getElement(selector: string): ElementFinder {
    return element.all(by.css(selector)).first();
  }

  getElements(selector: string): ElementArrayFinder {
    return element.all(by.css(selector));
  }

  getLocalStorageVar(name: string) {
    return browser.executeScript(`return window.localStorage.getItem('${name}');`);
  }

  getNumTabs() {
    return browser.getAllWindowHandles().then(wh => {
      return wh.length;
    });
  }

  async getRoute() {
    const url = await this.getUrl();
    return '/' + url.split(browser.baseUrl)[1];
  }

  getText(selector: string) {
    return element(by.css(selector)).getText() as Promise<string>;
  }

  getUrl() {
    return browser.getCurrentUrl();
  }

  scrollTo(selector: string) {
    return new Promise<boolean>(resolve => {
      browser.controlFlow().execute(() => {
        const script = 'arguments[0].scrollIntoView({block: "center", inline: "center"})';
        browser
          .executeScript(script, this.getElement(selector).getWebElement())
          .then(() => {
            resolve(true);
          });
      });
    });
  }

  setLocalStorageVar(name: string, value: string) {
    return browser.executeScript(`return window.localStorage.setItem('${name}','${value}');`);
  }

  switchFocusToTab(tabIndex: number) {
    return browser.getAllWindowHandles().then(wh => {
      return wh.forEach((h, i) => {
        if (i === tabIndex) { return browser.switchTo().window(h); }
      });
    });
  }

  waitFor(t: number) {
    return browser.sleep(t);
  }

  waitForClickable(selector: string) {
    const e = this.getElement(selector);
    return browser.wait(ExpectedConditions.elementToBeClickable(e), 5000);
  }

  waitForNotVisible(selector: string) {
    const e = this.getElement(selector);
    return browser.wait(ExpectedConditions.invisibilityOf(e), 5000);
  }

  waitForVisible(selector: string) {
    const e = this.getElement(selector);
    return browser.wait(ExpectedConditions.visibilityOf(e), 5000);
  }

}

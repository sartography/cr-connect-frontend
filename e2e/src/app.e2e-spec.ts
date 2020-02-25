import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('Clinical Research Coordinator App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display fake sign-in screen', () => {
    page.navigateTo();
    expect(page.getText('h1')).toEqual('FAKE UVA NETBADGE SIGN IN (FOR TESTING ONLY)');
  });

  it('should click sign-in and navigate to home screen', () => {
    page.clickAndExpectRoute('#sign_in', '/');
    expect(page.getElements('#cta_new_study').count()).toBeGreaterThan(0);
  });

  it('should navigate to help screen', () => {
    page.clickAndExpectRoute('#nav_help', '/help');
  });

  it('should navigate to profile', () => {
    page.clickElement('#nav_account');
    page.clickAndExpectRoute('#nav_profile', '/profile');
  });

  it('should navigate to notifications', () => {
    page.clickElement('#nav_account');
    page.clickAndExpectRoute('#nav_notifications', '/notifications');
  });

  it('should navigate back to home screen', () => {
    page.setLocalStorageVar('numstudy', '1');
    expect(page.getLocalStorageVar('numstudy')).toEqual('1');
    page.clickAndExpectRoute('#nav_home', '/');
    expect(page.getElements('#cta_new_study').count()).toBeGreaterThan(0);
  });

  it('should add a new study', async () => {
    // const numStudiesBefore = await page.getElements('app-study-card').count();

    // Should display message about going to Protocol Builder to add a new study.
    page.clickElement('#cta_new_study');
    expect(page.getElements('#cta_protocol_builder').count()).toEqual(1);

    // Should open Protocol Builder in new tab.
    const numTabsBefore = await page.getNumTabs();
    page.clickElement('#cta_protocol_builder');
    const numTabsAfter = await page.getNumTabs();
    expect(numTabsAfter).toBeGreaterThan(numTabsBefore);

    // Close the new tab.
    await page.switchFocusToTab(1);
    page.closeTab();
    await page.switchFocusToTab(0);

    // TODO: Create mock Protocol Builder and increment number of studies.
    // expect(numStudiesAfter).toBeGreaterThan(numStudiesBefore);

    const numStudiesAfter = await page.getElements('app-study-card').count();
    expect(numStudiesAfter).toBeGreaterThan(0);
  });

  it('should navigate to a study', async () => {
    const studyCard = page.getElement('app-study-card mat-card');
    const studyId = await studyCard.getAttribute('data-study-id');
    await expect(studyId).not.toBeUndefined();
    await expect(studyId).not.toBeNull();
    page.clickAndExpectRoute('app-study-card', '/study/' + studyId);
  });

  // it('should start a workflow', async () => {
  //   await page.clickElement('#startWorkflow');
  //   await page.waitFor(1000);
  // });

  it('should navigate to a workflow', async () => {
    expect(page.getElements('.chart-container').count()).toBeGreaterThan(0);
    const chart = page.getElement('.chart-container');
    const studyId = await chart.getAttribute('data-study-id');
    const workflowId = await chart.getAttribute('data-workflow-id');
    const expectedRoute = `/study/${studyId}/workflow/${workflowId}`;
    page.clickElement('.chart-container');
    expect(page.getRoute()).toContain(expectedRoute);
  });

  it('should sign out', () => {
    page.clickElement('#nav_account');
    page.clickAndExpectRoute('#nav_sign_out', '/sign-out');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});

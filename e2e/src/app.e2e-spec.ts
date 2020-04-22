import {browser, logging} from 'protractor';
import {HttpClient} from 'protractor-http-client';
import {AppPage} from './app.po';

describe('Clinical Research Coordinator App', () => {
  let page: AppPage;
  let http: HttpClient;

  beforeEach(() => {
    page = new AppPage();
    http = new HttpClient('http://localhost:5001');
  });

  it('should display fake sign-in screen', () => {
    page.navigateTo();
    expect(page.getText('h1')).toEqual('Fake UVA NetBadge Sign In (for testing only)');
  });

  it('should click sign-in and navigate to home screen', () => {
    page.clickAndExpectRoute('#sign_in', '/');
    expect(page.getElements('#cta_protocol_builder').count()).toBeGreaterThan(0);
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
    expect(page.getElements('#cta_protocol_builder').count()).toBeGreaterThan(0);
  });

  it('should open Protocol Builder in new window', async () => {
    expect(page.getElements('#cta_protocol_builder').count()).toEqual(1);
    expect(page.getElements('#cta_reload_studies').count()).toEqual(1);

    // Open Protocol Builder in new tab.
    const numTabsBefore = await page.getNumTabs();
    page.clickElement('#cta_protocol_builder');
    const numTabsAfter = await page.getNumTabs();
    expect(numTabsAfter).toBeGreaterThan(numTabsBefore);

    // Close Protocol Builder tab.
    await page.switchFocusToTab(1);
    await page.closeTab();
    await page.switchFocusToTab(0);
  });

  it('should load new study from Protocol Builder', async () => {
    const numStudiesBefore = await page.getElements('.study-row').count();

    // Add a new study to Protocol Builder.
    http.post('/new_study', '' +
      `STUDYID=${Math.floor(Math.random() * 100000)}&` +
      `TITLE=${encodeURIComponent('New study title')}&` +
      `NETBADGEID=czn1z&` +
      `DATE_MODIFIED=${encodeURIComponent(new Date().toISOString())}&` +
      `requirements=9&` +
      `requirements=21&` +
      `requirements=40&` +
      `requirements=44&` +
      `requirements=52&` +
      `requirements=53&` +
      `Q_COMPLETE=y`,
      {'Content-Type': 'application/x-www-form-urlencoded'}
    ).catch(error => {
      console.error(error);
    });
    http.failOnHttpError = false;

    // Reload the list of studies.
    await page.clickElement('#cta_reload_studies');
    await page.waitForNotVisible('.loading');
    await page.waitForClickable('.study-row');

    const numStudiesAfter = await page.getElements('.study-row').count();
    expect(numStudiesAfter).toBeGreaterThan(numStudiesBefore);
  });

  it('should navigate to a study', async () => {
    const studyRow = page.getElement('.study-row');
    const studyId = await studyRow.getAttribute('data-study-id');
    await expect(studyId).not.toBeUndefined();
    await expect(studyId).not.toBeNull();
    page.clickAndExpectRoute('.study-row', '/study/' + studyId);
  });

  it('should display workflow spec categories in tabs', async () => {
    const numTabs = await page.getElements('.workflow-list-item').count();
    expect(numTabs).toBeGreaterThan(0);

    for (let i=0; i < numTabs; i++) {
      page.clickElement(`#mat-tab-label-0-${i}`);
      await page.waitFor(500);
      expect(page.getElements('.workflow-list-item').count()).toBeGreaterThan(0);
    }
  });

  it('should navigate to a workflow', async () => {
    expect(page.getElements('.workflow-list-item').count()).toBeGreaterThan(0);
    const workflow = await page.getElement('.workflow-list-item .workflow-action');
    const studyId = await workflow.getAttribute('data-study-id');
    const workflowId = await workflow.getAttribute('data-workflow-id');
    const expectedRoute = `/study/${studyId}/workflow/${workflowId}/task/`;
    await page.clickElement('.workflow-list-item .workflow-action button');
    const newRoute = await page.getRoute();
    expect(newRoute.slice(0, expectedRoute.length)).toEqual(expectedRoute);
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

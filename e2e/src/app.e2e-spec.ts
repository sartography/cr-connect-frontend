import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('Study Administrator App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('CR CONNECT');
  });

  it('should click sign-in button', () => {
    page.clickAndExpectRoute('#cta_sign_in', '/sign-in');
  });

  it('should navigate to home screen', () => {
    page.clickAndExpectRoute('#nav_home', '/');
  });

  it('should navigate to help screen', () => {
    page.clickAndExpectRoute('#nav_help', '/help');
  });

  it('should navigate to sign-in screen', () => {
    page.clickAndExpectRoute('#nav_sign_in', '/sign-in');
  });

  it('should sign in', () => {
    page.clickAndExpectRoute('#nav_sign_in', '/sign-in');
    page.clickAndExpectRoute('#cta_sign_in', '/');
    expect(page.getElements('#cta_new_study').count()).toBeGreaterThan(0);
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
    const numStudiesBefore = await page.getElements('app-study-card').count();
    page.clickElement('#cta_new_study');
    page.clickElement('#cta_protocol_builder');
    const numStudiesAfter = await page.getElements('app-study-card').count();
    expect(numStudiesAfter).toBeGreaterThan(numStudiesBefore);
  });

  it('should navigate to a study', async () => {
    const studyCard = page.getElement('app-study-card mat-card');
    const studyId = await studyCard.getAttribute('data-study-id');
    page.clickAndExpectRoute('app-study-card', '/study/' + studyId);
  });

  it('should navigate to a workflow', async () => {
    const chart = page.getElement('.chart-container');
    const studyId = await chart.getAttribute('data-study-id');
    const workflowId = await chart.getAttribute('data-workflow-id');
    const expectedRoute = `/study/${studyId}/workflow/${workflowId}#process_category_0_0`;
    page.clickAndExpectRoute('.chart-container', expectedRoute);
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

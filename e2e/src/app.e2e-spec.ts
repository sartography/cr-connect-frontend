import {HttpClient} from 'protractor-http-client';
import {AppPage} from './app.po';

describe('Clinical Research Coordinator App', () => {
  let page: AppPage;
  let http: HttpClient;

  beforeEach(() => {
    page = new AppPage();
    http = new HttpClient('http://localhost:5001');
  });

  it('should automatically sign-in and redirect to home screen', () => {
    page.navigateTo();
    expect(page.getRoute()).toEqual('/home');
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
    page.clickAndExpectRoute('#nav_home', '/home');
  });

  it('should navigate to a study', async () => {
    const studyRow = page.getElement('.study-row');
    const studyId = await studyRow.getAttribute('data-study-id');
    await expect(studyId).not.toBeUndefined();
    await expect(studyId).not.toBeNull();
    page.clickAndExpectRoute('.study-row', '/study/' + studyId);
  });

  it('should display workflow spec categories in tiles', async () => {
    const numTiles = await page.getElements('.workflow-list-item').count();
    expect(numTiles).toBeGreaterThan(0);
  });

  it('should navigate to a workflow', async () => {
    const wfSelector = '.workflow-list-item .workflow-action';
    expect(page.getElements(wfSelector).count()).toBeGreaterThan(0);
    const workflow = await page.getElement(wfSelector);
    const studyId = await workflow.getAttribute('data-study-id');
    const catId = await workflow.getAttribute('data-category-id');
    const workflowId = await workflow.getAttribute('data-workflow-id');

    console.log('studyId', studyId);
    console.log('catId', catId);
    console.log('workflowId', workflowId);
    const expectedRoute = `/study/${studyId}/workflow/${workflowId}/task/`;
    await page.clickElement(wfSelector);
    const newRoute = await page.getRoute();
    expect(newRoute.slice(0, expectedRoute.length)).toEqual(expectedRoute);
  });

  // TODO: CATCH 401/403 ERRORS AND VERIFY THAT THEY REDIRECT TO LOGIN
  // afterEach(async () => {
  //   // Assert that there are no errors emitted from the browser
  //   const logs = await browser.manage().logs().get(logging.Type.BROWSER);
  //   expect(logs).not.toContain(jasmine.objectContaining({
  //     level: logging.Level.SEVERE,
  //   } as logging.Entry));
  // });
});

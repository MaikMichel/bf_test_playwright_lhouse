
import { playAudit } from 'playwright-lighthouse';
import { expect } from '@playwright/test';
import { getFormatedDate } from '../util/date-util';
import { lighthouseTest, setup } from '../util/test-util';
import lighthouseDesktopConfig from 'lighthouse/lighthouse-core/config/lr-desktop-config.js';
import { pathToFileURL } from 'url';
import path from 'path';


const testTitle = '01-login-page';
const expectedPageTitle = /Tasks - Log In/;

lighthouseTest.describe(testTitle, () => {
  // run the test
  lighthouseTest('should pass lighthouse accessibility tests', async ({ page, port }) => {

    // go to baseURL
    await page.goto('./');

    // check the title
    await expect(page).toHaveTitle(expectedPageTitle);

    // add Lighthouse report file as annotation
    lighthouseTest.info().annotations.push({
      type: "local-report",
      description: pathToFileURL(path.format(path.parse(`./lighthouse/${testTitle}.html`))).toString(),
    });

    // run LightHouse
    await playAudit({
      page,
      port,
      thresholds: {accessibility:100},
      reports: {
        formats: {
            html: true, //defaults to false
        },
        name: testTitle, //getFormatedDate(new Date()),
        directory: "lighthouse"
      },
      config: lighthouseDesktopConfig
    });
    lighthouseTest.info().annotations.push({
      type: "local-report",
      description: pathToFileURL(`./lighthouse/${testTitle}.html`).toString(),
    });

  });
});


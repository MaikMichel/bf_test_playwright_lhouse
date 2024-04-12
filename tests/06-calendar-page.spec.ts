import { playAudit } from 'playwright-lighthouse';
import { expect } from '@playwright/test';
import { getFormatedDate } from '../util/date-util';
import { lighthouseTest, login, setup } from '../util/test-util';
import lighthouseDesktopConfig from 'lighthouse/lighthouse-core/config/lr-desktop-config.js';
import { pathToFileURL } from 'url';
import path from 'path';

const testTitle = '06-calendar-page';
const expectedURLafterClickOnCard = /calendar/;

lighthouseTest.describe(testTitle, () => {
  // run the test
  lighthouseTest('should pass lighthouse accessibility tests', async ({ page, port }) => {
    // steps to login
    await login(page);

    // click the card
    await page.locator(':nth-child(4) > .t-Card > .t-Card-wrap > .t-Card-titleWrap').click();
    await expect(page).toHaveURL(expectedURLafterClickOnCard);

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
  });
});


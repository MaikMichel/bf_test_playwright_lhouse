import { playAudit } from 'playwright-lighthouse';
import { expect } from '@playwright/test';
import { getFormatedDate } from '../util/date-util';
import { lighthouseTest, login, setup } from '../util/test-util';
import lighthouseDesktopConfig from 'lighthouse/lighthouse-core/config/lr-desktop-config.js';
import { pathToFileURL } from 'url';
import path from 'path';

const testTitle = '05-tasks-report-page';
const expectedURLafterClickOnCard = /tasks\-report/;

lighthouseTest.describe(testTitle, () => {

  // run the test
  lighthouseTest('should pass lighthouse accessibility tests', async ({ page, port }) => {
    // steps to login
    await login(page);

    // click the card
    await page.locator(':nth-child(3) > .t-Card > .t-Card-wrap > .t-Card-titleWrap').click();
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


  // run the test
  lighthouseTest('should pass lighthouse accessibility tests with IFrame loaded', async ({ page, port }) => {
    // steps to login
    await login(page);

    // click the card
    await page.locator(':nth-child(3) > .t-Card > .t-Card-wrap > .t-Card-titleWrap').click();
    await expect(page).toHaveURL(expectedURLafterClickOnCard);

    // click edit
    await page.locator(':nth-child(2) > .a-IRR-linkCol > a > .fa').click();

    // check frames
    const mainURL = page.url();
    const frames = await page.frames();
    for (const frame of frames) {
      // run promise to have an url
      const frameContent = await frame.content();

      // if not on main frame
      if (frame.url() != mainURL) {
        // goto to frame as page
        await page.goto(frame.url());

        // add Lighthouse report file as annotation
        lighthouseTest.info().annotations.push({
          type: "local-report",
          description: pathToFileURL(path.format(path.parse(`./lighthouse/${testTitle}-frame.html`))).toString(),
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
            name: testTitle+"-frame", //getFormatedDate(new Date()),
            directory: "lighthouse"
          },
          config: lighthouseDesktopConfig
        });
      }
    }


  });
});


import { chromium } from 'playwright';
import type { Browser } from 'playwright';
import getPort from 'get-port';
import { test as base, expect} from '@playwright/test';
import { getFormatedDate } from './date-util';
import { playAudit } from 'playwright-lighthouse';
import { Page } from '@playwright/test';

export const lighthouseTest = base.extend<
  {},
  { port: number; browser: Browser }
>({
  port: [
    async ({}, use) => {
      // Assign a unique port for each playwright worker to support parallel tests
      const port = await getPort();
      await use(port);
    },
    { scope: 'worker' },
  ],

  browser: [
    async ({ port }, use) => {
      const browser = await chromium.launch({
        args: [`--remote-debugging-port=${port}`, `--site-per-process`],
      });
      await use(browser);
    },
    { scope: 'worker' },
  ],
});

export async function login(page: Page) {
  const expectedLoginPageTitle = /Tasks - Log In/;
  const expectedURLpathAfterLogin = /\/home/;

  // go to baseURL
  await page.goto('./');

  // check the title
  await expect(page).toHaveTitle(expectedLoginPageTitle);

  await page.locator('#P9999_USERNAME').fill(process.env.PLWR_USERNAME!);
  await page.locator('#P9999_PASSWORD').fill(process.env.PLWR_PASSWORD!);
  await page.keyboard.press('Enter');

  // check the url path
  await expect(page).toHaveURL(expectedURLpathAfterLogin);
}

export const setup = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1450,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
  },
};
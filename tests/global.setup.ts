import { test as setup } from '@playwright/test';
import { rmSync } from 'fs';

setup('cleanup reporting folder', async ({ }) => {
  console.log('cleanup reporting folder');
  await rmSync("./lighthouse/", {recursive:true, force:true});
});
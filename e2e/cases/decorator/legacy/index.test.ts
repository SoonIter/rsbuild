import { expect, test } from '@playwright/test';
import { build, getHrefByEntryName } from '@scripts/shared';

test('decorator legacy(default)', async ({ page }) => {
  const rsbuild = await build({
    cwd: __dirname,
    runServer: true,
  });

  await page.goto(getHrefByEntryName('index', rsbuild.port));
  expect(await page.evaluate('window.aaa')).toBe('hello world');

  if (rsbuild.providerType !== 'rspack') {
    expect(await page.evaluate('window.ccc')).toContain(
      "Cannot assign to read only property 'message' of object",
    );
  }

  await rsbuild.close();
});

import { test, expect } from '@playwright/test';

// Roster for goldens – 26 shop skins + keystones
const SHOP_IDS = [
  'moss','sky','coral','charcoal','fog','bluebird','apple_shine','honey','lilac','acorn',
  'spring_fade','autumn_fade','blue_lagoon','cotton_candy','sunset','sunrise',
  'polka_mint','ripple','rainbow','sprinkles','vanilla_sprinkles',
  'confetti','lava_flow','aurora','dark_aurora','biolume','nebula','phoenix_heart'
];

const SIZE = 128;

test.describe('golden screenshots', () => {
  for (const id of SHOP_IDS) {
    test(`skin: ${id}`, async ({ page }) => {
      // Use explicit html path to work reliably with vite preview in CI
      await page.goto(`/goldens.html?id=${id}&size=${SIZE}&scale=1`);
      const locator = page.locator('div').first();
      await expect(locator).toHaveScreenshot(`${id}.png`, {
        animations: 'disabled',
        scale: 'css',
        maxDiffPixelRatio: 0.003,
      });
    });
  }
});



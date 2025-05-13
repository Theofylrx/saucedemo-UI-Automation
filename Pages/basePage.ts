import { Page } from '@playwright/test';
import config from '../lib/config/config';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path?: string) {
    const url = path ? config.url + path : config.url;
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }
}

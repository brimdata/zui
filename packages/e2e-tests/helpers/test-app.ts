import { Client } from '@brimdata/zed-node';
import { existsSync } from 'fs';
import { reject } from 'lodash';
import * as path from 'path';
import {
  ElectronApplication,
  Page,
  _electron as electron,
} from 'playwright-chromium';
import { isCI, isLinux, isMac, itestDir } from './env';

export default class TestApp {
  zui: ElectronApplication;
  zealot: Client;
  mainWin: Page;
  testNdx = 1;
  currentDataDir: string;

  constructor(private name: string) {
    this.zealot = new Client('http://localhost:9867');
  }

  find(...args: Parameters<Page['locator']>) {
    return this.mainWin.locator(...args);
  }

  async init() {
    const userDataDir = path.resolve(
      path.join(itestDir(), this.name, (this.testNdx++).toString())
    );
    this.currentDataDir = userDataDir;
    const { bin, entry } = getAppInfo();
    const launchOpts = {
      args: [`--user-data-dir=${userDataDir}`, entry],
      bypassCSP: true,
      timeout: 10000,
    };

    // @ts-ignore
    if (bin) launchOpts.executablePath = bin;
    this.zui = await electron.launch(launchOpts);
    await waitForTrue(() => this.zui.windows().length === 2);
    await waitForTrue(async () => !!(await this.getWindowByTitle('Zui')));
    await waitForTrue(
      async () => !!(await this.getWindowByTitle('Background'))
    );
    this.mainWin = await this.getWindowByTitle('Zui');
  }

  async createPool(
    filepaths: string[],
    expectedResult = 'Load Successful'
  ): Promise<void> {
    await this.mainWin.getByRole('button', { name: 'create' }).click();
    await this.mainWin.locator('li:has-text("New Pool")').click();
    const [chooser] = await Promise.all([
      this.mainWin.waitForEvent('filechooser'),
      this.mainWin.locator('text=Choose Files').click(),
    ]);
    await chooser.setFiles(filepaths);
    await this.zui.evaluate((_electron, filePaths) => {
      global.e2eFilePaths = filePaths;
    }, filepaths);
    await this.mainWin.getByRole('button', { name: 'Create Pool' }).click();
    await this.mainWin.getByText(expectedResult).waitFor();
  }

  async chooseFiles(locator, paths: string[]) {
    const [chooser] = await Promise.all([
      this.mainWin.waitForEvent('filechooser'),
      locator.click(),
    ]);

    await chooser.setFiles(paths);
  }

  async deleteAllPools() {
    const pools = await this.zealot.getPools();
    for (let pool of pools) {
      await this.zealot.deletePool(pool.id);
    }
  }

  async query(zed: string): Promise<void> {
    await this.mainWin.locator('div[role="textbox"]').fill(zed);
    await this.mainWin.locator('[aria-label="run-query"]').click();
    await this.mainWin.locator('span[aria-label="fetching"]').isHidden();
  }

  async getViewerResults(includeHeaders = true): Promise<string[]> {
    const fields = await this.mainWin.locator('.zed-table__cell');
    await fields.waitFor();
    let results = await fields.evaluateAll<string[], HTMLElement>((nodes) =>
      nodes.map((n) => n.innerText.trim())
    );
    if (includeHeaders) {
      const headers = await this.mainWin.locator('.zed-table__header-cell');
      const headerResults = await headers.evaluateAll<string[], HTMLElement>(
        (headerCells) => headerCells.map((hc) => hc.innerText.trim())
      );
      results = headerResults.concat(results);
    }

    return results;
  }

  async getViewerStats(): Promise<{ results: number; shapes: number }> {
    const results = await this.mainWin
      .locator('span[aria-label="results"]')
      .textContent();
    const shapes = await this.mainWin
      .locator('span[aria-label="shapes"]')
      .textContent();

    const toInt = (str: string) => parseInt(str.replace(/\D*/, ''));
    return { results: toInt(results), shapes: toInt(shapes) };
  }

  async shutdown() {
    await this.zui.close();
  }

  async getWindowByTitle(title: string): Promise<Page> {
    const wins = await this.zui.windows();
    const winTitles = await Promise.all(wins.map((w) => w.title()));
    return wins[winTitles.findIndex((wTitle) => wTitle === title)];
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  get results() {
    return this.mainWin.getByTestId('results-pane');
  }
}

const getAppInfo = () => {
  const macInstallPath = '/Applications/Zui.app/Contents/MacOS/Zui';
  const linuxInstallPath = '/usr/bin/zui';
  const packagedEntryPoint = 'app.asar/app/dist/js/electron/main.js';

  if (isCI() && isMac() && existsSync(macInstallPath)) {
    return {
      bin: macInstallPath,
      entry: path.join(
        macInstallPath,
        'Contents/Resources',
        packagedEntryPoint
      ),
    };
  }
  if (isCI() && isLinux() && existsSync(linuxInstallPath)) {
    return {
      bin: linuxInstallPath,
      entry: path.join(linuxInstallPath, 'resources', packagedEntryPoint),
    };
  }

  return { bin: null, entry: '../..' };
};

function waitForTrue(check: () => boolean | Promise<boolean>) {
  return new Promise<void>((resolve) => {
    const id = setTimeout(() => reject('Gave up'), 30000);
    const run = async () => {
      if (await check()) {
        clearTimeout(id);
        resolve();
      } else {
        setTimeout(() => run(), 100);
      }
    };
    run();
  });
}

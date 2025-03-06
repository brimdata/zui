import { expect } from '@playwright/test';
import { Client } from '@brimdata/zed-node';
import { existsSync, statSync } from 'fs';
import * as path from 'path';
import {
  ElectronApplication,
  Page,
  _electron as electron,
} from 'playwright-chromium';
import { isCI, isLinux, isMac, itestDir } from './env';

type Role = Parameters<Page['getByRole']>[0];
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
    } as any;

    if (process.env.VIDEO == 'true') {
      launchOpts.recordVideo = { dir: path.join('run', 'videos') };
    }
    // @ts-ignore
    if (bin) launchOpts.executablePath = bin;
    this.zui = await electron.launch(launchOpts);

    // Pipe the stdout from the electron process into the test runner process
    if (process.env['VERBOSE']) {
      this.zui.process().stdout.pipe(process.stdout);
    }
    await waitForTrue(() => this.zui.windows().length === 2);
    await waitForTrue(async () => !!(await this.getWindowByTitle('Zui')));
    await waitForTrue(
      async () => !!(await this.getWindowByTitle('Background'))
    );
    this.mainWin = await this.getWindowByTitle('Zui');

    const debug = false;
    if (debug) {
      this.mainWin.on('console', console.log);
      this.zui.process().stdout.on('data', (data) => {
        console.log(data.toString());
      });
    }
  }

  async dropFile(file: string) {
    await this.mainWin.evaluate((file) => {
      // @ts-ignore
      globalThis.dropFiles([file]);
    }, file);
  }

  get page() {
    return this.mainWin;
  }

  async createPool(
    filepaths: string[],
    expectedResult = /Successfully finished loading/
  ): Promise<void> {
    await this.mainWin.evaluate((filepaths) => {
      // @ts-ignore
      globalThis.dropFiles(filepaths);
    }, filepaths);
    await this.click('button', 'Load');
    await this.detached('dialog', 'preview-load');
    await this.attached(expectedResult);
  }

  async chooseFiles(locator: any, paths: string[]) {
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

  getLocationKey() {
    return this.page
      .locator('[data-location-key]')
      .getAttribute('data-location-key');
  }

  waitForNextLocationKey(prevKey: string) {
    return this.page
      .locator(`[data-location-key="${prevKey}"]`)
      .waitFor({ state: 'detached' });
  }

  async query(zed: string): Promise<void> {
    const prevKey = await this.getLocationKey();
    await this.setEditor(zed);
    await this.mainWin.getByRole('button', { name: 'Run Query' }).click();
    await this.waitForNextLocationKey(prevKey);
    await this.mainWin.getByRole('status', { name: 'fetching' }).isHidden();
  }

  async setEditor(zed: string) {
    await this.mainWin.getByTestId('main-editor').click();
    await this.mainWin.keyboard.press(isMac() ? 'Meta+KeyA' : 'Control+KeyA');
    await this.mainWin.keyboard.type(zed);
  }

  async getEditorText() {
    return await this.mainWin.getByTestId('main-editor').textContent();
  }

  async getTabCount() {
    const tablist = this.page.locator('[role=tablist][id=main-area-tabs]');
    const tabs = tablist.getByRole('tab');
    return await tabs.count();
  }

  async getTableResults(includeHeaders = true): Promise<string[]> {
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

  async getInspectorResults(): Promise<string[]> {
    const fields = await this.mainWin.locator('.zed-view');
    await fields.waitFor();
    let results = await fields.evaluateAll<string[], HTMLElement>((nodes) =>
      nodes.map((n) => n.innerText.trim().replaceAll(/\s+/g, ' '))
    );

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

  sleep(sec: number) {
    return new Promise((resolve) => setTimeout(resolve, sec * 1000));
  }

  get results() {
    return this.mainWin.getByTestId('results-pane');
  }

  async click(role: Role | RegExp, name?: string, options?: object) {
    return this.locate(role, name, options).click();
  }

  async rightClick(role: Role | RegExp, name?: string, options?: object) {
    return this.locate(role, name, options).click({ button: 'right' });
  }

  async attached(role: Role | RegExp, name?: string, options?: object) {
    return this.locate(role, name, options).waitFor();
  }

  async detached(role: Role | RegExp, name?: string, options?: object) {
    return this.locate(role, name, options).waitFor({ state: 'detached' });
  }

  async hidden(role: Role | RegExp, name?: string, options?: object) {
    return this.locate(role, name, options).waitFor({ state: 'hidden' });
  }

  async visible(role: Role | RegExp, name?: string, options?: object) {
    return this.locate(role, name, options).waitFor({ state: 'visible' });
  }

  async fill(label: string, value: string) {
    return this.page.getByLabel(label).fill(value);
  }

  async press(key: string) {
    return this.page.keyboard.press(key);
  }

  async select(label: string, value: string) {
    return this.page.getByLabel(label).selectOption(value);
  }

  locate(role: Role | RegExp, name?: string, options?: any) {
    if (role instanceof RegExp) {
      return this.mainWin.getByText(role).first();
    } else {
      return this.mainWin
        .getByRole(role, { name, exact: true, ...options })
        .first();
    }
  }

  async invoke(name: string, ...args: any[]) {
    return await this.page.evaluate(
      ({ name, args }) => {
        // @ts-ignore
        return window.zui.invoke(name, ...args);
      },
      { name, args }
    );
  }

  get evalMain() {
    return this.zui.evaluate.bind(this.zui);
  }

  get evalPage() {
    return this.page.evaluate.bind(this.page);
  }

  debugLogs() {
    this.zui.process().stdout.on('data', (d) => console.log(d.toString()));
    this.zui.process().stderr.on('data', (d) => console.log(d.toString()));
  }

  async takeScreenshot(filename: string) {
    return await this.page.screenshot({
      path: path.join('run', 'screenshots', filename),
      fullPage: true,
    });
  }

  mockSaveDialog(result: { canceled: boolean; filePath: string | null }) {
    this.zui.evaluate(async ({ dialog }, result) => {
      dialog.showSaveDialog = () => Promise.resolve(result);
    }, result);
  }

  async exportAsFormat(label: string, expectedSize: number, tempDir: string) {
    const file = path.join(tempDir, `results.${label}`);
    this.mockSaveDialog({ canceled: false, filePath: file });
    await this.click('button', 'Export Results');
    await this.attached('dialog');
    const dialog = this.mainWin.getByRole('dialog');
    await this.select('Format', label);
    await dialog
      .getByRole('button')
      .filter({ hasText: 'Export To File' })
      .click();
    await this.detached('dialog');
    await this.mainWin
      .getByText(new RegExp('Export Completed: .*results\\.' + label))
      .waitFor();

    expect(statSync(file).size).toBe(expectedSize);
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

  return { bin: null, entry: '../../apps/zui' };
};

function waitForTrue(check: () => boolean | Promise<boolean>) {
  return new Promise<void>((resolve, reject) => {
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

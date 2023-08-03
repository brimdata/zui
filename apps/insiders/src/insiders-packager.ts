import * as path from 'path';
import * as fs from 'fs-extra';
import * as semver from 'semver';

const p = (...args: unknown[]) => console.log('‣', ...args);

const INSIDERS_ROOT = path.join(__dirname, '..');
const ZUI_ROOT = path.join(__dirname, '../../zui');

type Meta = {
  name: string;
  productName: string;
  repository: string;
  description: string;
  version: string;
  lake: {
    port: number;
  };
};

export class InsidersPackager {
  root: string;
  appRoot: string;
  appMeta: Meta;
  lastVersion: string;
  constructor(lastVersion: string) {
    this.root = INSIDERS_ROOT;
    this.appRoot = ZUI_ROOT;
    this.appMeta = this.getMeta(this.appRoot);
    this.lastVersion = (semver.valid(lastVersion) as string) && lastVersion;
    if (!semver.valid(this.lastVersion))
      throw new Error('Invalid last version');
  }

  get stableVersion() {
    return this.appMeta.version;
  }

  get nextVersion() {
    const version =
      this.strategy === 'match-stable'
        ? this.stableVersion
        : semver.inc(this.lastVersion, 'prerelease');

    return version;
  }

  get strategy() {
    if (semver.gt(this.stableVersion, this.lastVersion)) {
      return 'match-stable';
    } else {
      return 'increment-dev';
    }
  }

  get injectedProperties() {
    return {
      name: 'zui-insiders',
      productName: 'Zui - Insiders',
      repository: 'https://github.com/brimdata/zui-insiders',
      description: 'Zui for early adopters with frequent updates.',
      lake: { port: 9988 },
      version: this.nextVersion,
    };
  }

  injectAppPackageJSON() {
    p("Injecting app's package.json with:", this.injectedProperties);
    const json = Object.assign({}, this.appMeta, this.injectedProperties);
    const path = this.getMetaPath(this.appRoot);
    fs.writeJSONSync(path, json, { spaces: 2 });
  }

  getMeta(root: string) {
    return fs.readJsonSync(this.getMetaPath(root));
  }

  getMetaPath(dir: string) {
    return path.join(dir, 'package.json');
  }
}

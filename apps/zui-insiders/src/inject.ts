import { InsidersPackager } from './insiders-packager';
import { getLatestInsidersVersion } from './latest';

async function main() {
  const latest = await getLatestInsidersVersion();
  const pkg = new InsidersPackager(latest);
  pkg.injectAppPackageJSON();
}

main();

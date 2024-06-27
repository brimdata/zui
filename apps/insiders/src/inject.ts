import { InsidersPackager } from './insiders-packager';

async function main() {
  const latest = process.argv[2];
  if (!latest) throw new Error('Provide Latest Version');

  const pkg = new InsidersPackager(latest);
  pkg.injectAppPackageJSON();
}

main();

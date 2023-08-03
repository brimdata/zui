import { getLatestInsidersVersion } from './latest';

async function main() {
  const latest = await getLatestInsidersVersion();
  console.log(latest);
}

main();

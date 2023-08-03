import { getLatestInsidersSha } from './latest';

async function main() {
  const currentSha = process.env['GITHUB_SHA'];
  const releaseSha = await getLatestInsidersSha();

  console.log('Last Release:', releaseSha);
  console.log('     Current:', currentSha);

  if (releaseSha.trim() === currentSha) {
    console.log('No Update Needed');
    process.exit(1);
  } else {
    console.log('Continue Update');
  }
}

main();

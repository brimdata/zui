import { getLatestInsidersSha } from './latest';

async function main() {
  const lastVersion = process.argv[2];
  if (!lastVersion) throw new Error('Provide Latest Version');
  const currentSha = process.env['GITHUB_SHA'];
  const releaseSha = await getLatestInsidersSha(lastVersion);

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

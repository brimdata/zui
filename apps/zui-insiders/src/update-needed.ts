import { getCurrentCommitHash } from './commit';
import { getLatestInsidersVersion } from './latest';
import * as semver from 'semver';

function extractCommitFromVersion(version: string) {
  const parts = semver.parse(version);

  if (parts && parts.build.length === 1) {
    return parts.build[0];
  } else {
    return null;
  }
}

async function main() {
  const version = await getLatestInsidersVersion();
  const head = getCurrentCommitHash();
  const lastCommit = extractCommitFromVersion(version);
  const updateNeeded = !(head === lastCommit);
  if (updateNeeded) {
    console.log('Update needed');
  } else {
    console.log('Update not needed');
    process.exit(1);
  }
}

main();

import { execSync } from 'child_process';

export function getCurrentCommitHash() {
  // GitHub Actions puts the commit sha in the GITHUB_SHA env var
  return execSync(
    `git rev-parse --short ${process.env['GITHUB_SHA'] || 'head'}`
  )
    .toString()
    .replace('\n', '');
}

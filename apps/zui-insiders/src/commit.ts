import { execSync } from 'child_process';

export function getCurrentCommitHash() {
  return execSync('git rev-parse --short head').toString().replace('\n', '');
}

import devkit from '@nrwl/devkit';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import * as url from 'url';
import { execSync } from 'child_process';

const args = process.argv.slice(2);
const version = args[0];

function invariant(condition, message) {
  if (!condition) {
    console.error(chalk.bold.red(message));
    process.exit(1);
  }
}

// A simple SemVer validation to validate the version
const validVersion = /^\d+\.\d+\.\d+(-\w+\.\d+)?/;
invariant(
  version && validVersion.test(version),
  `No version provided or version did not match Semantic Versioning, expected: #.#.#-tag.# or #.#.#, got ${version}.`
);

const graph = devkit.readCachedProjectGraph();

for (const [name, project] of Object.entries(graph.nodes)) {
  const root = url.fileURLToPath(new URL('../..', import.meta.url));
  const packageJSON = path.join(root, project.data.root, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packageJSON, 'utf-8'));
  pkg.version = version;

  const deps = devkit.getDependentPackagesForProject(graph, name);
  for (let dep of deps.workspaceLibraries) {
    if (dep.importKey in (pkg.dependencies ?? {})) {
      pkg.dependencies[dep.importKey] = version;
    }
    if (dep.importKey in (pkg.peerDependencies ?? {})) {
      pkg.peerDependencies[dep.importKey] = version;
    }
    if (dep.importKey in (pkg.devDependencies ?? {})) {
      pkg.peerDependencies[dep.importKey] = version;
    }
  }
  fs.writeFileSync(packageJSON, JSON.stringify(pkg, null, 2) + '\n');
}

execSync('yarn');

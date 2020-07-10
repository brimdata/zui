[![CircleCI](https://circleci.com/gh/brimsec/brim.svg?style=svg&circle-token=8fb219d4419937d21fb70c99c89157bff05c2ecc)](https://circleci.com/gh/brimsec/brim)

# Brim Development

Thank you for contributing to Brim! Feel free to [open an issue](https://github.com/brimsec/brim/wiki/Troubleshooting#opening-an-issue), fork the repo, or send us a pull request.

Brim is early in its life cycle and will be expanding quickly.  Please star and/or watch the repo so you can follow and track our progress.

## Code Base Walkthrough

Before you start, review the [Code Base Walkthrough](https://github.com/brimsec/brim/wiki/Code-Base-Walkthrough). This doc provides an overview of the directory structure, libraries used, and other useful details for new developers. A [YouTube video](https://www.youtube.com/watch?v=CPel0iu1pig) is also available that provides a detailed walk-through of the material.

## Setup

You should have `node v12.12.0` and `git` installed. You can start a local instance of Brim via:

```bash
git clone https://github.com/brimsec/brim
cd brim
npm install
npm start
```

`npm install` will download all required dependencies, including zqd and zeek. Running `npm start` will compile files from `./src` to `./dist` and open the app. When a file is changed, it will recompile it and reload the app.

On subsequent updates, `git pull` then `npm install`.

### zqd

`zqd`, from the [zq](https://github.com/brimsec/zq) repository, is the daemon responsible for data ingestion and query execution. As an npm postinstall step, a`zqd`binary is downloaded and stored in the`./zdeps`directory. Brim will automatically execute and terminate the zqd binary from`./zdeps` on application start and exit.

When developing features that need a non-released zqd instance, you can:

- change the `brimsec/zq` dependency in package.json to refer to a branch or git commit, either in `brimsec/zq` or some fork. If the dependency doesn't look like an official tagged zq repository, the Brim npm postinstall step will try to build and use zqd from the specified commit.
- Or, you can build zqd yourself, and make it accessible via PATH, then run `brim_zqd_from_path=1 npm start`.

### zeek

Brim, via zqd, uses [Zeek](https://www.zeek.org) to convert packet captures into Zeek logs. These logs are then combined and stored in [ZNG](https://github.com/brimsec/zq/blob/master/zng/docs/spec.md) format.

As an npm postinstall step, a [zeek artifact](https://github.com/brimsec/zeek/releases) is downloaded and expanded into the `./zdeps/zeek` directory. This artifact contains a zeek binary and associated scripts, and a "zeek runner" script or command that is called by zqd. zqd is passed the full path to the zeek runner via the `-zeekrunner` command line option. When a pcap file is ingested, zqd runs the zeek runner with no arguments and its working directory set to an output directory for the zeek TSV logs, and then feeds the pcap data to the zeek runner via stdin. zqd then internally converts the zeek TSV logs into ZNG format.

An alternate Zeek setup may be used by overriding the zeek runner location. This may be done either by launching Brim with the `BRIM_ZEEK_RUNNER` environment variable set to the absolute path of a zeek runner script or commmand, or by setting the "Zeek Runner" preference in the Brim UI. See the [Zeek Customization](https://github.com/brimsec/brim/wiki/Zeek-Customization) wiki article for additional details.

## Tests

Unit tests use [Jest](https://jestjs.io/) which has an [excellent cli](https://jestjs.io/docs/en/cli). Here are some examples you might use frequently.

```bash
npm test                                      # Run all the tests
npx jest Client.test.js                       # Run a single test file
npx jest Client.test.js -t "increment by one" # Run a single test by name
npx jest --watch                              # Run all tests on every change
```

For integration tests, see [itest/README.md](itest/README.md).

**Snapshots**

Some tests use `expect(result).toMatchSnapshot()`. The first time the test is run, it stores the result in a `.snap` file automatically. Later runs, compare their results to the snapshot. Snapshots can easily be updated with the `-u` command line option.

```bash
npx jest -u # Updates all snapshots with results from this run
```

You can selectively update snapshots by running a single file or test and appending the `-u` option.

```bash
npx jest query.test.js -u # Only updates snapshots used in query.test.js
```

## Pull Requests

Our CI server checks for code format diffs, flow type errors, eslint errors, unit test failures, and integration test failures. You can check all these things locally before pushing your branch.

```bash
npm run format # Prettier formats and saves the project files
npm run lint   # Check eslint
npm run flow   # Check flow
npm test       # Unit tests with jest
npm run itest  # Integration tests with jest & spectron

npm run check  # Runs all the above at once except for itests
```

## Installation Packaging

You can create an installable artifact - like a disk image for MacOS - via:

```bash
npm run release
```

Any platform artifacts created will be found under `./dist/installers`.

### MacOS Notarization

[Notarized](https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution)
MacOS releases are created automatically by our CI process when a Github
release is created. The below is useful if you need to create one by hand.

```bash
npm run build
APPLEID_USER=<user> APPLEID_PASSWORD=<app-specific-password> node ./scripts/release --darwin --notarize
```

Where `APPLEID_USER` is the apple ID user name, and `APPLEID_PASSWORD` is an app-specific password created for notarization (details [here](https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution/customizing_the_notarization_workflow)). This will also sign the contents of the package, which requires a [Developer ID](https://developer.apple.com/developer-id/) certificate to be present in your keychain.

Notarization can take some time to complete ("typically less than an hour"). If you want to check on the status of the notarization request, run:

```bash
xcrun altool --notarization-history 0 -u <user> -p <app-specific-password>
```

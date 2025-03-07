# Zui Development

Thank you for contributing to Zui!

Per common practice, please [open an issue](https://zui.brimdata.io/docs/support/Troubleshooting#opening-an-issue) before sending a pull request. If you think your ideas might benefit from some refinement via Q&A, come talk to us on [Slack](https://www.brimdata.io/join-slack/) as well.

## Setup

Install these dependencies:

1. [Node](https://nodejs.org/en/download/package-manager/) - the version specified in the `.node-version` file at the root folder.
2. [Yarn](https://yarnpkg.com/) - a package manager for installing dependencies and starting Zui in dev mode.
3. [Go](https://go.dev/doc/install) - to compile some [Zed](https://zed.brimdata.io/) dependencies.
4. Typical command line tools, such as `make`, `unzip`, and `curl`

Then clone the repo, install the node modules, and start the app.

```bash
git clone https://github.com/brimdata/zui
cd zui
yarn
yarn start
```

When a file is changed, it will be recompiled and the app will automatically reload.

On subsequent updates, `git pull` and `yarn`.

## Libraries

Zui is a TypeScript, React, Electron app.

- [Electron](https://www.electronjs.org/docs/latest) - it's helpful to understand the [main vs renderer processes](https://www.electronjs.org/docs/latest/tutorial/quick-start#main-and-renderer-processes)
- [TypeScript](https://www.typescriptlang.org/)
- [Prettier](https://prettier.io/docs/en/index.html)
- [React](https://reactjs.org/docs/getting-started.html)
- [Styled Components](https://styled-components.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Jest](https://jestjs.io/docs/en/getting-started)
- [Playwright](https://playwright.dev/)

## Entry Points

- Main process - `src/js/electron/main.ts`
- Renderer process - `src/js/search.tsx`

## Directory Structure

This directory structure is a work in progress. You will see many files not in the places described here. Please migrate what you can and follow this for any new code.

```
├── app (renderer code)
│   ├── core (generic shared code)
│   ├── features (larger app features)
│   ├── initializers (code run on startup)
│   ├── plugins (plugin code)
│   ├── routes (entry points for each url)
│   ├── state (ui state)
│   ├── window-a.tsx (window entry points)
│   └── window-b.tsx
├── electron (main process code)
└── ppl (licensed code)
```

**Import Rule**: Only import modules from `/core`, `/state`, or your own descendants. Components in `/routes` can import modules from `/features`.

## Testing

We have a few different types of test suites.

1. Unit test - `test/unit`
2. API tests - `test/api`
3. System tests - `test/system`
4. Integration tests `test/playwright`

We use [Jest Projects](https://jestjs.io/docs/configuration#projects-arraystring--projectconfig) to organize the configuration for these.

## Unit Tests

Unit tests go right next to the file they are testing with a `.test.js` suffix.

There are several ways to run unit tests.

```bash
# Run all
yarn jest --projects test/unit
# Run by name
yarn jest --projects test/unit -- name-of-test
```

## System Tests

System tests sit between unit tests and integration tests. To create one, instantiate a `SystemTest` class at the top level of any test file.

```js
const system = new SystemTest("name-of-test")
```

This will run the electron main process entry point, `main.js`, which spins up a local Zed lake. You then mount the root `<App />` component into the JSDOM testing environment and begin to simulate a user clicking buttons and asserting elements exist. This is done with [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/).

```js
import {screen} from "@testing-library/react"
import {SystemTest} from "src/test/system/system-test"

const system = new SystemTest("my-test")

test("click the button", async () => {
  system.mountApp()
  const button = screen.getByRole("button", {name: "Submit"})
  system.click(button)
  await screen.findByText("Complete!")
})
```

All backend requests are made with Node and hit the local Zed lake. Any browser APIs that are not in JSDOM are mocked or polyfilled. The electron APIs are mocked as well. You can find them in `test/shared/__mocks__/electron`.

The `SystemTest` class comes with a few helper methods for commonly performed actions in the Zui app like _.runQuery(q)_, _.ingestFile_(name), _.navTo(path)_, and _.render(jsx)_. It also re-exports some of the common [userEvent](https://testing-library.com/docs/ecosystem-user-event/) methods like _.click()_ and _.rightClick()_

They can be run like so:

```bash
# Run all
yarn jest --projects test/system
# Run by name
yarn jest --projects test/system -- name-of-test
```

## Styles

Use the Styled Components library to style new components. Previously, we used scss files located in `src/css`. Many of the components are styled with scss, and class names, but we recently committed to Styled Components. We also have a "theme" that holds all the common colors and styles used in our UI.

## Migrations

Because we persist state on a user's computer, if they upgrade Zui and we've changed the expected state, we need to migrate the old state. If any of the reducers in `src/js/state` are changed, we need to write a migration. There is a tool we built to help with this. You can run, for example:

```bash
bin/gen migration addScrollPositionToViewer
```

This creates a file in `src/js/state/migrations` with a function that can manipulate the persisted state from the previous version.

See the [Adding Migrations](https://zui.brimdata.io/docs/developer/Adding-Migrations) page for a more detailed guide.

### Zed

The [Zed service](https://zed.brimdata.io/docs/commands/zed#serve) is the daemon responsible for data ingestion and query execution. As a postinstall step, the `zed` binary is downloaded and stored in the `./zdeps` directory. Zui will automatically execute and terminate the service when it starts and stops.

## Pull Requests

Our CI server checks for code format diffs, type errors, unit test failures, and integration test failures. You can check all these things locally before pushing your branch.

```bash
yarn format           # Prettier format
yarn tsc              # Check the types
yarn test             # Unit tests with jest
yarn test:api         # API tests
yarn test:system      # System Tests
yarn test:playwright  # Integration tests with jest & playwright
```

## Installation Packaging

[Releases](https://github.com/brimdata/zui/releases) with installable artifacts are created automatically by an [Actions Workflow](../../.github/workflows/release.yml) when a GA release is tagged.

You can installable artifacts based on your own checkout via:

```bash
yarn build
yarn release
```

Any platform artifacts created will be found under `./installers`.

This will create packages for the detected OS platform, e.g., `.deb` and `.rpm`
packages if on Linux. Creation of your own macOS (`.dmg`) and Windows (`.exe`)
artifacts requires additional settings described in the following sections.

### MacOS Notarization and Code Signing

To create [notarized](https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution)
MacOS packages by hand, set the following environment variables before running
the `yarn` commands shown above.

```bash
export APPLE_ID=<user>
export APPLE_TEAM_ID=<team-id>
export APPLE_ID_PASSWORD=<app-specific-password>
```

Where `APPLE_ID` is the Apple ID user name (typically an email address), `APPLE_TEAM_ID` is the Team ID from the user's [Apple Developer Account](https://developer.apple.com/account/) page, and `APPLE_ID_PASSWORD` is an app-specific password created for notarization (details [here](https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution/customizing_the_notarization_workflow)). This will also sign the contents of the package, which requires a [Developer ID certificate](https://developer.apple.com/developer-id/) to be present in your keychain.

Notarization can take some time to complete ("typically less than an hour"). If you want to check on the status of the notarization request, run:

```bash
xcrun notarytool history --apple-id <apple-user-id> --password <app-specific-password> --team-id <apple-team-id>
```

### Windows Code Signing

The changes in [ballot CSC-17](https://cabforum.org/2022/09/27/ballot-csc-17-subscriber-private-key-extension/)
from the [CA/B Forum](https://cabforum.org/) have made it such that GA Zui
releases on Windows are currently only signed using a cloud service.
PR [zui/3050](https://github.com/brimdata/zui/pull/3050) provides details of
how this is currently performed with [SSL.com's eSigner](https://www.ssl.com/esigner/).
If you successfully sign Zui with another service or sign manually and have
tips to share based on your experience, please [contact us](#questions).

## Licensing

This repository contains source code that is licensed under either a
BSD-3-Clause license or the Polyform Perimeter license - see the LICENSE.txt
file for specifics.

If you make a contribution to this repository, whether to source code licensed
under the BSD-3-Clause license or the Polyform Perimeter license, you agree
that you are licensing your contribution under the terms of the BSD-3-Clause
license found in LICENSE.txt, and you agree that you have the right to license
your contribution under those license terms.

### Why the two licenses?

We want to prevent technology giants from using the Polyform Perimeter license
covered code to create replacement offerings of our projects.

The overwhelming majority of Zui or Zed users and developers will not be
restricted by this license, including those using Zui or Zed in commercial
settings.

The use of the source-available Polyform Perimeter license prevents use
cases like:

- Marketing a work as a “as-a-service” style offering for server
  components like Zed, while using material covered under the Polyform
  Perimeter license
- Marketing a work as a replacement for the Zui desktop application,
  while using material covered under the Polyform Perimeter license

We believe users and developers should have access to the source code for our
project, and we need a sustainable business model to continue funding our
work. Using the source-available Polyform Perimeter license on portions
of the source code lets us realize both.

## Questions?

We appreciate your interest in improving Zui. If you've got questions that aren't answered here, please join our [public Slack](https://www.brimdata.io/join-slack/) workspace and ask!

[![CircleCI](https://circleci.com/gh/looky-cloud/desktop.svg?style=svg&circle-token=8fb219d4419937d21fb70c99c89157bff05c2ecc)](https://circleci.com/gh/looky-cloud/desktop)
# Looky Desktop

The desktop client for the Boom backend built with Electron and React.

## Setup

It's expected that `node 10.11.0` and `git` are installed. See [Auth Setup](#auth-setup) below for possible additional steps.

```
git clone https://github.com/looky-cloud/desktop.git
cd desktop
npm install
npm start
```

Newer versions of Node are probably ok, too. For instance, the version installing on macOS via `brew` as of October, 2018 is `10.12.0` and seems to run the desktop client fine.

Running `npm start` will compile files in `./src` to `./dist` and open the app. When a file is changed, it will recompile it and reload the app.

### Auth Setup

Because desktop depends on [looky-cloud/boom-js-client](https://github.com/looky-cloud/boom-js-client), Git must be configured to work with HTTPS, which may require an auth token, or Git must be configured to re-write HTTPS URLs to use SSH.

1. For HTTPS (Github-preferred):
   1. If your Github account uses two-factor authentication, create an authentication token and use it in place of your password. Refer to [this page](https://help.github.com/articles/which-remote-url-should-i-use/#cloning-with-https-urls-recommended).
1. For SSH:
   1. Refer to [this page](https://help.github.com/articles/which-remote-url-should-i-use/#cloning-with-ssh-urls).
   1. Override Github HTTPS URLs to use SSH.
      ```
      git config --global url.ssh://git@github.com.insteadof https://github.com
      ```

## Tests

Run all the tests:

```
npm test
```

Run a single test:

```
npx jest Clint.test.js
```

Run all the tests and watch for changes:

```
npx jest --watch
```

## Style

This project uses eslint and prettier for style consistency.

Run the linter:

```
npm run lint
```

Run the code formatter:

```
npm run format
```

## Release

```
npm run release
```

This creates installers for both Windows and MacOS that can be found in `./dist/installers`.

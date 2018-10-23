# Looky Desktop

The desktop client for the Boom backend built with Electron and React.

## Setup

It's expected that `node 10.11.0` and `git` are installed.

```
git clone https://github.com/looky-cloud/desktop.git
cd desktop
npm install
npm start
```

Newer versions of Node are probably ok, too. For instance, the version installing on macOS via `brew` as of October, 2018 is `10.12.0` and seems to run the desktop client fine.

Running `npm start` will compile files in `./src` to `./dist` and open the app. When a file is changed, it will recompile it and reload the app.

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

This packages the app into `./releases` for the host's architecture.

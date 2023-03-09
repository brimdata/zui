## Test Strategy

Since the JavaScript runtime situation is a hot mess, we've got a "special" testing setup.

We build the library with commonjs for node, and esm for the web. As a result we need to test both versions of the build. Instead of using something like jest, to run tests on source files and transpile them on the fly, we run the tests on the build files in the dist folder. You'll need to run `yarn build` before running tests.

```
yarn build
```

Before we run any tests, we need to start a zed server.

```
yarn support:lake
```

Then seed the lake with the test example data.

```
yarn support:seed
```

To test the commonjs version, we use mocha. (why not use jest?)

```
yarn test:cjs
```

To test the es module version, we use cypress.

```
yarn test:esm
```

/* @flow */
// Taken from
// https://github.com/facebook/jest/issues/3126#issuecomment-345949328 to allow
// async / await in tests.
// $FlowFixMe
import "regenerator-runtime/runtime"

// This signals the path setup in main.js to not override the userData
// directory it sees on startup, so that we can store complete application
// state and logs for each individual integration test. It also signals not
// try to install the dev tools.
process.env.BRIM_ITEST = "true"

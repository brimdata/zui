/**
 * This is annoying. When the project is built, it all goes in the dist
 * folder which is one more level deep. Jest doesn't use dist, it compiles
 * the source files in memory and tests them there.
 *
 * We wouldn't need this check if we had a src and a dist folder on the same
 * level. Maybe that should be the case again.
 */
let packageJSON
if (process.env.NODE_ENV === "test") {
  packageJSON = require("../../../package.json")
} else {
  packageJSON = require("../../../../package.json")
}

export default packageJSON

const pkg = require("../package.json")
const {join} = require("node:path")

class Artifact {
  get name() {
    return `${pkg.productName} Setup ${pkg.version}.exe`
  }

  get dir() {
    return join(__dirname, "../../../dist/apps/superdb-desktop")
  }

  get path() {
    return join(this.dir, this.name)
  }
}

module.exports = new Artifact()

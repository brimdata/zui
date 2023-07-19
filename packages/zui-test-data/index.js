const path = require("path")

module.exports = {
  /**
   * @param {string} name
   * @returns string
   */
  getPath(name) {
    return path.join(__dirname, "data", name)
  },
}

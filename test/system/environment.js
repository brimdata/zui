require("regenerator-runtime/runtime")
const _ = require("lodash")
const {writeFileSync} = require("fs-extra")
const JSDOMEnvironment = require("jest-environment-jsdom")

class SystemEnvironment extends JSDOMEnvironment {
  async handleTestEvent(event, state) {
    if (event.name === "test_fn_failure") {
      const file = _.snakeCase(state.currentlyRunningTest.name)
      writeFileSync(
        `./run/${file}_failed.html`,
        this.global.document.querySelector("html").outerHTML
      )
    }
  }
}

module.exports = SystemEnvironment

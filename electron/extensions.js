/* @flow */
// Note that whenever these extensions need to be updated,
// go and delete them from app.getPath("userData")/extensions,
// then restart the app.

const isDev = require("electron-is-dev")

function installExtensions() {
  if (isDev) {
    const {
      default: install,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS
    } = require("electron-devtools-installer")

    install(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err))

    install(REDUX_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err))
  }
}

module.exports = {installExtensions}

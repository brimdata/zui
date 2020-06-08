/* @flow */
// Note that whenever these extensions need to be updated,
// go and delete them from app.getPath("userData")/extensions,
// then restart the app.

function installExtensions() {
  // const {
  //   default: install,
  //   REACT_DEVELOPER_TOOLS,
  //   REDUX_DEVTOOLS
  // } = require("electron-devtools-installer")
  //
  // install(REACT_DEVELOPER_TOOLS)
  //   .then((name) => console.log(`Added Extension:  ${name}`))
  //   .catch((err) => console.log("An error occurred: ", err))
  //
  // install(REDUX_DEVTOOLS)
  //   .then((name) => console.log(`Added Extension:  ${name}`))
  //   .catch((err) => console.log("An error occurred: ", err))
  // BrowserWindow.removeDevToolsExtension("React Developer Tools")
  // BrowserWindow.removeDevToolsExtension("Redux DevTools")
}

module.exports = {installExtensions}

import {createOperation} from "src/core/operations"
import {appUpdater} from "./app-updater"

export const open = createOperation("updates.open", ({main}) => {
  main.windows.create("update")
})
//
export const check = createOperation("updates.check", async () => {
  appUpdater.check()
})

export const install = createOperation("updates.install", async () => {
  appUpdater.download()
})

//  MANUAL FLOW
// 1. user click check for updates
// 2. app triggers update check
// 3. app opens update window

// 4. update window checks state
// 5. renders progress bar if state.isChecking
// 8. renders up to date if state.isUpToDate
// 9. renders new version available if state.newVersionAvailable
// 10. Button to Install
// 11. Button to Cancel
// 12. Note that you can change update settings in Settings

// AUTO FLOW
// app auto checks on startup,
// app downloads update in the background
// app waits until restart to install
// app udates menu with "New Version Available..."
// when the auu quits it will be updated

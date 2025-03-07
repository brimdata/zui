import {releaseNotesPath} from "src/app/router/utils/paths"
import Appearance from "../state/Appearance"
import Modal from "../state/Modal"
import Tabs from "../state/Tabs"
import {Store} from "../state/types"
import initNewSearchTab from "./initNewSearchTab"
import Editor from "../state/Editor"
import {commands as cmds} from "src/app/commands/command"
import * as zed from "../../../../../packages/superdb-types/dist"
import {viewLogDetail} from "../flows/viewLogDetail"
import tabHistory from "src/app/router/tab-history"
import {submitSearch} from "src/domain/session/handlers"
import cmd from "src/cmd"

export default (store: Store) => {
  global.zui.on("clearPins", () => {
    store.dispatch(Editor.deleteAllPins())
    store.dispatch(Editor.setValue(""))
    submitSearch()
  })

  global.zui.on("toggleLeftSidebar", () => {
    store.dispatch(Appearance.toggleSidebar())
  })

  global.zui.on("toggleRightSidebar", () => {
    store.dispatch(Appearance.toggleSecondarySidebar())
  })

  global.zui.on("showPreferences", () => {
    store.dispatch(Modal.show("settings"))
  })

  global.zui.on("showExportResults", () => {
    store.dispatch(Modal.show("export"))
  })

  global.zui.on("back", () => {
    store.dispatch(tabHistory.goBack())
  })

  global.zui.on("forward", () => {
    store.dispatch(tabHistory.goForward())
  })

  global.zui.on("closeTab", () => {
    cmd.tabs.closeActive()
  })

  global.zui.on("windows:newSearchTab", (e, {params}) => {
    initNewSearchTab(store, params)
  })

  global.zui.on("globalStore:dispatch", (e, {action}) => {
    store.dispatch(action)
  })

  global.zui.on("showReleaseNotes", () => {
    store.dispatch(Tabs.create(releaseNotesPath()))
  })

  global.zui.on("runCommand", (e, id, ...args) => {
    cmds.run(id, ...args)
  })

  global.zui.on("detail-window-args", (e, opts) => {
    if (opts) {
      global.windowHistory.replace(opts.url)
      const value = zed.decode(opts.value) as zed.Record
      if (value) {
        store.dispatch(viewLogDetail(value))
      }
    }
  })
}

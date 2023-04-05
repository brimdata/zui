import {releaseNotesPath} from "src/app/router/utils/paths"
import Appearance from "../state/Appearance"
import Current from "../state/Current"
import Layout from "../state/Layout"
import Modal from "../state/Modal"
import Tabs from "../state/Tabs"
import {Store} from "../state/types"
import initNewSearchTab from "./initNewSearchTab"
import Editor from "../state/Editor"
import submitSearch from "src/app/query-home/flows/submit-search"
import {commands} from "src/app/commands/command"
import {decode, zed} from "@brimdata/zed-js"
import {viewLogDetail} from "../flows/viewLogDetail"
import tabHistory from "src/app/router/tab-history"

export default (store: Store) => {
  global.zui.listen("clearPins", () => {
    store.dispatch(Editor.deleteAllPins())
    store.dispatch(Editor.setValue(""))
    store.dispatch(submitSearch())
  })

  global.zui.listen("toggleLeftSidebar", () => {
    store.dispatch(Appearance.toggleSidebar())
  })

  global.zui.listen("toggleRightSidebar", () => {
    store.dispatch(Layout.toggleDetailPane())
  })

  global.zui.listen("showPreferences", () => {
    store.dispatch(Modal.show("settings"))
  })

  global.zui.listen("showExportResults", () => {
    store.dispatch(Modal.show("export"))
  })

  global.zui.listen("back", () => {
    store.dispatch(tabHistory.goBack())
  })

  global.zui.listen("forward", () => {
    store.dispatch(tabHistory.goForward())
  })

  global.zui.listen("closeTab", () => {
    store.dispatch(Tabs.closeActive())
  })

  global.zui.listen("windows:newSearchTab", (e, {params}) => {
    initNewSearchTab(store, params)
  })

  global.zui.listen("globalStore:dispatch", (e, {action}) =>
    store.dispatch(action)
  )

  global.zui.listen("showReleaseNotes", () => {
    const id = Current.getLakeId(store.getState())
    store.dispatch(Tabs.create(releaseNotesPath(id)))
  })

  global.zui.listen("toggleHistogram", () => {
    store.dispatch(Layout.toggleHistogram())
  })

  global.zui.listen("runCommand", (e, id, ...args) => {
    commands.run(id, ...args)
  })

  global.zui.listen("detail-window-args", (e, opts) => {
    if (opts) {
      global.windowHistory.replace(opts.url)
      const value = decode(opts.value) as zed.Record
      if (value) {
        store.dispatch(viewLogDetail(value))
      }
    }
  })
}

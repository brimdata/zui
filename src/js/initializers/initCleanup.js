/* @flow */
import {ipcRenderer} from "electron"

import type {Store} from "../state/types"
import closeWindow from "../flows/closeWindow"
import refreshWindow from "../flows/refreshWindow"
import getUrlSearchParams from "../lib/getUrlSearchParams"

export default function(store: Store) {
  ipcRenderer.on("close", () => store.dispatch(closeWindow()))
  global.onbeforeunload = () => {
    const {name} = getUrlSearchParams()
    if (name === "detail") return
    store.dispatch(refreshWindow())
  }
}

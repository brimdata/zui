/* @flow */
import {ipcRenderer} from "electron"

import type {Store} from "../state/types"
import closeWindow from "../flows/closeWindow"
import refreshWindow from "../flows/refreshWindow"

export default function(store: Store) {
  ipcRenderer.on("close", () => store.dispatch(closeWindow()))
  global.onbeforeunload = () => store.dispatch(refreshWindow())
}

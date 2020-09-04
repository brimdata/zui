
import { ipcRenderer } from "electron";

import { Store } from "../state/types";
import closeWindow from "../flows/closeWindow";

export default function (store: Store) {
  ipcRenderer.on("close", () => store.dispatch(closeWindow()));
}

import { ipcMain } from "electron";

import { $WindowManager } from "../../tron/windowManager";
import ipc from "..";
import sendTo from "../sendTo";

export default function (store: any, winMan: $WindowManager) {
  ipcMain.handle("globalStore:init", () => {
    return {
      initialState: store.getState()
    };
  });

  ipcMain.handle("globalStore:dispatch", (e, {
    action
  }) => {
    store.dispatch(action);
    for (let win of winMan.getWindows()) {
      if (!win.ref.isDestroyed()) {
        sendTo(win.ref.webContents, ipc.globalStore.dispatch(action));
      }
    }
  });
}

import { Application } from "spectron";

import { $Field } from "../../src/js/brim";
import { LOG } from "./log";
import { Space } from "../../src/js/state/Spaces/types";
import Log from "../../src/js/models/Log";
import menu from "../../src/js/electron/menu";

// This module exists to work around difficulties in using Spectron to drive
// Brim with its components that use Electron's native support. Right now
// that's the right-click menu, which has recently gone native. See the
// long-standing issue here:
// https://github.com/electron-userland/spectron/issues/21
export default function contextMenuShim(app: Application, program: string, columns: string[], space: Space) {
  return {
    program(value: string) {
      program = value;
      return this;
    },

    click(label: string, field: $Field, log: Log) {
      LOG.debug('Creating menu from log entry on field "' + field.toString() + '"...');
      let ipcMenu = menu.searchFieldContextMenu(program, columns, space)(field, log, false);
      LOG.debug(`Finding menu item with label "${label}"...`);
      let item = ipcMenu.find(item => item.label && item.label === label);
      // The item.click test below is needed to make flow happy.
      if (item && item.click) {
        LOG.debug("About to click menu item...");
        item.click(item, { webContents: app.webContents });
      } else {
        throw new Error("Could not find '" + label + "' in context menu");
      }

      return this;
    }
  };
}
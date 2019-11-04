/* @flow */
import {Application} from "spectron"
import type {Space} from "../../src/js/lib/Space"
import Field from "../../src/js/models/Field"
import Log from "../../src/js/models/Log"
import menu from "../../src/js/electron/menu"

// This module exists to work around difficulties in using Spectron to drive
// Brim with its components that use Electron's native support. Right now
// that's the right-click menu, which has recently gone native. See the
// long-standing issue here:
// https://github.com/electron-userland/spectron/issues/21
export default function contextMenu(
  app: Application,
  program: string,
  columns: string[],
  space: Space
) {
  return {
    program(value: string) {
      program = value
      return this
    },

    click(label: string, field: Field, log: Log) {
      let item = menu
        .fieldContextMenu(program, columns, space)(
          field.toBrimField(),
          log,
          false
        )
        .find((item) => item.label && item.label === label)

      if (item && item.click) {
        item.click(item, {webContents: app.webContents})
      } else {
        throw new Error("Could not find '" + label + "' in context menu")
      }

      return this
    }
  }
}

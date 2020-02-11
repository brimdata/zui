/* @flow */
import {BrowserWindow} from "electron"

import type {WindowKeep} from "./windowState"

export type WindowParams = {}

export default function window(
  name: string,
  params: WindowParams,
  state: WindowKeep
) {
  let set = stateSetter(state, name)
  let get = stateGetter(state, name)
  let [x, y] = get("position")
  let [width, height] = get("size")

  return new BrowserWindow({
    titleBarStyle: "hidden",
    resizable: true,
    width,
    height,
    x,
    y,
    webPreferences: {
      nodeIntegration: true,
      experimentalFeatures: true
    }
  })
    .on("move", (e) => set("position", e.sender.getPosition()))
    .on("resize", (e) => set("size", e.sender.getSize()))
    .on("closed", () => state.save())
    .loadFile(`${name}.html`, {query: params})
}

function stateSetter(state, name) {
  return (field, value) => {
    try {
      state.set(name + "." + field, value)
    } catch (e) {
      console.error(e)
    }
  }
}

function stateGetter(state, name) {
  return (field) => state.get(name + "." + field)
}

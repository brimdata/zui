import {createSelector} from "@reduxjs/toolkit"
import activeTabSelect from "../Tab/activeTabSelect"
import buildPin from "./models/build-pin"

export const getPins = activeTabSelect((tab) => {
  return tab.editor.pins
})

export const getPinEditIndex = activeTabSelect((tab) => {
  return tab.editor.pinEditIndex
})

export const getValue = activeTabSelect((tab) => {
  return tab.editor.value
})

export const getQuery = createSelector(getValue, getPins, (value, pins) => {
  return pins
    .map(buildPin)
    .map((p) => p.toZed())
    .concat([value])
    .join(" | ")
})

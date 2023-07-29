import {createSelector, nanoid} from "@reduxjs/toolkit"
import {QueryVersion} from "../QueryVersions/types"
import activeTabSelect from "../Tab/activeTabSelect"

export const getPins = activeTabSelect((tab) => {
  return tab.editor.pins
})

export const getPinEditIndex = activeTabSelect((tab) => {
  return tab.editor.pinEditIndex
})

export const getValue = activeTabSelect((tab) => {
  return tab.editor.value
})

export const getPinHoverIndex = activeTabSelect((tab) => {
  return tab.editor.pinHoverIndex
})

export const getPinCount = activeTabSelect((tab) => {
  return tab.editor.pins.length
})

export const getSnapshot = activeTabSelect((tab) => {
  return {
    value: tab.editor.value,
    pins: tab.editor.pins,
    version: nanoid(),
    ts: new Date().toISOString(),
  } as QueryVersion
})

export const isEmpty = createSelector(getValue, getPins, (value, pins) => {
  return value.trim() === "" && pins.length === 0
})

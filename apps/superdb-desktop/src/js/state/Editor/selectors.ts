import {createSelector} from "@reduxjs/toolkit"
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
  }
})

export const isEmpty = createSelector(getValue, getPins, (value, pins) => {
  return value.trim() === "" && pins.length === 0
})

export const getMarkers = activeTabSelect((tab) => {
  return tab.editor.markers
})

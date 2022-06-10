import activeTabSelect from "../Tab/activeTabSelect"

export const getPins = activeTabSelect((tab) => {
  return tab.editor.pins
})

export const getPinEditIndex = activeTabSelect((tab) => {
  return tab.editor.pinEditIndex
})

export const getHeight = activeTabSelect((tab) => {
  return tab.editor.height
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

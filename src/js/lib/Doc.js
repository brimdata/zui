/* @flow */

export type FixedPos = {
  top?: number,
  right?: number,
  left?: number,
  bottom?: number,
  height?: number,
  width?: number
}

export const id = (name: string) => {
  const el = document.getElementById(name)
  if (el) return el
  else throw new Error(`Could not find DOM node with id: ${name}`)
}

export const selectText = (node: HTMLElement) => {
  if (window.getSelection) {
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(node)
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

export const clearTextSelection = () => {
  window.getSelection && window.getSelection().empty()
}

export const getWidth = () => {
  return window.innerWidth
}

export const getHeight = () => {
  return window.innerHeight
}

export const copyToClipboard = (string: string) => {
  const el = document.createElement("textarea")
  el.value = string
  const body = document.body
  if (!body) {
    throw new Error("Can't find document body")
  }
  body.appendChild(el)
  el.select()
  document.execCommand("copy")
  body.removeChild(el)
}

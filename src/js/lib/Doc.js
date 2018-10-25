/* @flow */

export const id = (name: string) => {
  const el = document.getElementById(name)
  if (el) return el
  else throw new Error(`Could not find DOM node with id: ${name}`)
}

export const selectText = (node: HTMLElement) => {
  const selection = window.getSelection()
  const range = document.createRange()
  range.selectNodeContents(node)
  selection.removeAllRanges()
  selection.addRange(range)
}

export const clearTextSelection = () => {
  window.getSelection().empty()
}

export default {
  getWidth() {
    return window.innerWidth
  },

  getHeight() {
    return window.innerHeight
  },

  clearTextSelection() {
    window.getSelection && window.getSelection().empty()
  },

  selectText(node: HTMLElement) {
    if (window.getSelection) {
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(node)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }
}

export default {
  noScroll: () => document.body.classList.add("no-scroll"),
  yesScroll: () => document.body.classList.remove("no-scroll"),
  offset: node => {
    const rect = node.getBoundingClientRect()
    const win = node.ownerDocument.defaultView

    return {
      top: rect.top + win.scrollY,
      left: rect.left + win.scrollX
    }
  }
}

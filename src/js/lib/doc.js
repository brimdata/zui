/* @flow */
export default {
  id(id: string) {
    const el = document.getElementById(id)
    if (el) return el
    else throw new Error(`Could not find DOM node with id: ${id}`)
  },

  copyToClipboard(string: string) {
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
}

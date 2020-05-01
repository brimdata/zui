/* @flow */
export default function() {
  document.addEventListener("mousedown", () => {
    let el = document.body
    if (!el) return
    el.classList.add("using-mouse")
    el.classList.remove("using-keyboard")
  })
  document.addEventListener("keydown", () => {
    let el = document.body
    if (!el) return
    el.classList.add("using-keyboard")
    el.classList.remove("using-mouse")
  })
}

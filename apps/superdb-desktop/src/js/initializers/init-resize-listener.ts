export function initResizeListener() {
  let id
  function reset() {
    clearTimeout(id)
  }
  function addClass() {
    document.body.classList.add("is-dragging")
  }
  function removeClass() {
    document.body.classList.remove("is-dragging")
  }
  function schedule(fn, ms) {
    id = setTimeout(fn, ms)
  }

  window.onresize = () => {
    reset()
    addClass()
    schedule(removeClass, 150)
  }
}

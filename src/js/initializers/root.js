/* @flow */

export default () => {
  const el = document.getElementById("app-root")

  if (!el) {
    throw new Error("#app-root needs to exist on the page")
  }
  return el
}

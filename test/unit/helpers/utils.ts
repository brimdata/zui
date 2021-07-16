export function onPage(name: string) {
  window.history.replaceState(null, `Testing Page: ${name}`, `${name}.html`)
}

export function flushPromises() {
  return new Promise(setTimeout)
}

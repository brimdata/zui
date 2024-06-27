export function flushPromises() {
  return new Promise((r) => setTimeout(r))
}

export function isAbortError(e: unknown) {
  return e instanceof DOMException && e.message.match(/user aborted/)
}

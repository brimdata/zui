export function nextAnimationFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve))
}

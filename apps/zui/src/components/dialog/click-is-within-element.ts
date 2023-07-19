export function clickIsWithinElement(e: MouseEvent, el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  return (
    e.clientX > rect.left &&
    e.clientX < rect.right &&
    e.clientY > rect.top &&
    e.clientY < rect.bottom
  )
}

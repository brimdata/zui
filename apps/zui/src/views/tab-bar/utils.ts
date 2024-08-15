export function getSize(element: HTMLElement) {
  return element.getBoundingClientRect().width
}

export function getGap(element) {
  return parseInt(getComputedStyle(element).gap)
}

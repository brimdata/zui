export default function popupPosition(anchor: HTMLElement) {
  const {x, y, height} = anchor.getBoundingClientRect()
  const pad = 10
  return {x: Math.round(x), y: Math.round(y + height + pad)}
}

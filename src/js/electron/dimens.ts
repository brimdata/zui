const SCREEN_PADDING = 50

export function getWindowDimens(saved, defaults, screens) {
  const bounds = screens.find((screen) =>
    intersects(pad(screen, SCREEN_PADDING), saved)
  )
  if (bounds) {
    return {
      x: saved.x,
      y: saved.y,
      width: Math.min(saved.width, bounds.width),
      height: Math.min(saved.height, bounds.height)
    }
  } else {
    return defaults
  }
}

function pad(rect, padding) {
  return {
    x: rect.x + padding,
    y: rect.y + padding,
    width: rect.width - padding * 2,
    height: rect.height - padding * 2
  }
}

function intersects(a, b) {
  const toLeft = a.x + a.width < b.x
  const toRight = a.x > b.x + b.width
  const above = a.y + a.height < b.y
  const below = a.y > b.y + b.height

  return !(toLeft || toRight || above || below)
}

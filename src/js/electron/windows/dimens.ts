import {BrowserWindowConstructorOptions} from "electron"
import {Rectangle} from "electron/main"
import {pick} from "lodash"

const SCREEN_PADDING = 50

export type Dimens = {
  x: number | undefined
  y: number | undefined
  width: number
  height: number
}

export function dimensFromSizePosition(
  size: [number, number],
  position: [number, number] | undefined
): Dimens {
  return {
    x: position && position[0],
    y: position && position[1],
    width: size && size[0],
    height: size && size[1],
  }
}

export function getWindowDimens(
  saved: Partial<Dimens> = {},
  defaults: Dimens,
  screens: Electron.Rectangle[]
) {
  const bounds = screens.find((screen) =>
    intersects(pad(screen, SCREEN_PADDING), saved)
  )
  if (bounds && saved.width && saved.height) {
    return {
      x: saved.x,
      y: saved.y,
      width: Math.min(saved.width, bounds.width),
      height: Math.min(saved.height, bounds.height),
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
    height: rect.height - padding * 2,
  }
}

function intersects(a, b) {
  const toLeft = a.x + a.width < b.x
  const toRight = a.x > b.x + b.width
  const above = a.y + a.height < b.y
  const below = a.y > b.y + b.height

  return !(toLeft || toRight || above || below)
}

export function center(inner: Rectangle, outer: Rectangle): Rectangle {
  return {
    x: Math.floor(Math.max(outer.x + (outer.width - inner.width) / 2, outer.x)),
    y: Math.floor(
      Math.max(outer.y + (outer.height - inner.height) / 2, outer.y)
    ),
    height: Math.min(inner.height, outer.height),
    width: Math.min(inner.width, outer.width),
  }
}

export function stack(prev: Rectangle, screen: Rectangle, distance: number) {
  const width = Math.min(prev.width, screen.width)
  const height = Math.min(prev.height, screen.height)

  const moveCoord = (point, length, max) => {
    if (length === max) return 0
    if (point + distance + length < max) return point + distance
    return (point + distance + length) % max
  }

  return {
    x: moveCoord(prev.x - screen.x, width, screen.width) + screen.x,
    y: moveCoord(prev.y - screen.y, height, screen.height) + screen.y,
    width,
    height,
  }
}

export function pickDimens(options: BrowserWindowConstructorOptions = {}) {
  return pick(options, "width", "height", "x", "y") as Dimens
}

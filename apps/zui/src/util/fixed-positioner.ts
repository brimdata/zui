export function fixedPositioner(props: {
  target: HTMLElement
  anchor?: HTMLElement
  targetPoint?: string
  anchorPoint?: string
  targetMargin?: string
  keepOnScreen?: boolean
}) {
  /* Default Fallbacks */
  const doc = document.documentElement
  const target = props.target
  const anchor = props.anchor ?? doc
  const anchorPoint = props.anchorPoint ?? "center center"
  const targetPoint = props.targetPoint ?? "center center"
  const targetMargin = props.targetMargin ?? "0 0 0 0"
  const keepOnScreen = props.keepOnScreen ?? true

  /* Set Up Variables */
  const anchorRect = anchor.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()
  const leftMin = 0
  const leftMax = doc.clientWidth - leftMin
  const topMin = 0
  const topMax = doc.clientHeight - topMin
  const [anchorX, anchorY] = parsePoint(anchorPoint)
  const [targetX, targetY] = parsePoint(targetPoint)
  const margin = parseMargin(targetMargin)

  console.log({a: anchorRect, t: targetRect})

  /* 1. Start with the anchor's top left position */
  let left = anchorRect.left
  let top = anchorRect.top

  /* 2. Move target's top left corner to the anchor's point */
  if (anchorX === "center") left = anchorRect.left + anchorRect.width / 2
  if (anchorX === "left") left = left + 0
  if (anchorX === "right") left = left + anchorRect.width
  if (anchorY === "center") top = anchorRect.top + anchorRect.height / 2
  if (anchorY === "top") top = top + 0
  if (anchorY === "bottom") top = top + anchorRect.height

  /* 3. Move the target so that the targetPoint is on top of the anchorPoint */
  if (targetX === "center") left = left - targetRect.width / 2
  if (targetX === "left") left = left + 0 + margin.left
  if (targetX === "right") left = left - targetRect.width - margin.right
  if (targetY === "center") top = top - targetRect.height / 2
  if (targetY === "top") top = top + 0 + margin.top
  if (targetY === "bottom") top = top - targetRect.height - margin.bottom

  /* 4. Try to keep the target on the screen */
  if (keepOnScreen) {
    const {width, height} = targetRect
    if (left + width > leftMax) {
      const diff = left + width - leftMax
      left -= diff
    }
    // then If you overflow to the left, set at left limit
    if (left < leftMin) {
      left = leftMin
    }
    // If you overflow on the bottom, back up
    if (top + height > topMax) {
      const diff = top + height - topMax
      top -= diff
    }
    // then If you overflow on the top, set at top limit
    if (top < topMin) {
      top = topMin
    }
  }

  return {top, left}
}

/* Private Functions */

export function parsePoint(point: string): [string, string] {
  const words = point.split(/\s+/).map((s) => s.trim())
  if (words.length === 0) throw new Error("No words passed to point")
  if (words.length === 1) throw new Error("Must pass two words to point")
  if (words.length > 2) throw new Error("Too many words passed to point")

  return words.sort((a, b) => {
    if (a === "left" || a === "right") return -1
    if (a === "top" || a === "bottom") return 1
    if (b === "top" || b === "bottom") return -1
    if (b === "left" || b === "right") return 1
    return 0
  }) as [string, string]
}

function parseMargin(s: string) {
  const parts = s
    .split(/\s+/)
    .map((s) => s.trim())
    .map(toPixels)
  if (parts.length === 0) throw new Error("Invalid margin")
  if (parts.length === 1) {
    return {left: parts[0], right: parts[0], top: parts[0], bottom: parts[0]}
  }
  if (parts.length === 2) {
    return {top: parts[0], bottom: parts[0], left: parts[1], right: parts[1]}
  }
  if (parts.length === 3) {
    return {top: parts[0], right: parts[1], left: parts[1], bottom: parts[2]}
  }
  if (parts.length === 4) {
    return {top: parts[0], right: parts[1], left: parts[2], bottom: parts[3]}
  }
  throw new Error("Invalid margin")
}

function toPixels(s: string) {
  if (s === "0") return 0
  if (/\d+px/.test(s)) return parseInt(s)

  throw new Error("Only pixel values accepted")
}

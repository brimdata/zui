/* @flow */

import lib from "../../lib"

export function getPopMenuPosition(position: string, wrapperRect: Object) {
  let {top, left, width, height} = wrapperRect

  let overflow = []
  if (top < 0) overflow.push("top")
  if (left < 0) overflow.push("left")
  if (left + width > lib.win.getWidth()) overflow.push("right")
  if (top + height > lib.win.getHeight()) overflow.push("bottom")

  let truePos = position
  overflow.forEach((over) => {
    if (over === "top") truePos = truePos.replace("top", "bottom")
    if (over === "bottom") truePos = truePos.replace("bottom", "top")
    if (over === "right") truePos = truePos.replace(/left|center/, "right")
    if (over === "left") truePos = truePos.replace(/right|center/, "left")
  })

  return truePos
}

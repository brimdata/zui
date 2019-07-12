/* @flow */
import {getHeight, getWidth} from "../../lib/Doc"

export default class PopMenuStyler {
  a: Object
  w: Object
  pad: number

  constructor(anchorRect: Object, wrapperRect: Object, pad: number) {
    this.a = anchorRect
    this.w = wrapperRect
    this.pad = pad
  }

  getStyle(alignment: string) {
    let [style] = this._style(alignment)
    let overs = this._overflows(style)
    let align = this._realign(alignment, overs)
    return this._style(align)
  }

  _overflows(style: Object) {
    let overs = []
    if (style.top < 0) overs.push("top")
    if (style.left < 0) overs.push("left")
    if (style.left + this.w.width > getWidth()) overs.push("right")
    if (style.top + this.w.height > getHeight()) overs.push("bottom")
    return overs
  }

  _realign(alignment: string, overflows: string[]) {
    let re = alignment
    overflows.forEach((item) => {
      if (item === "top") re = re.replace("top", "bottom")
      if (item === "bottom") re = re.replace("bottom", "top")
      if (item === "right") re = re.replace(/left|center/, "right")
      if (item === "left") re = re.replace(/right|center/, "left")
    })
    return re
  }

  _style(alignment: string) {
    return [
      this._reduce(alignment, wrapperStyles),
      this._reduce(alignment, pointerStyles)
    ]
  }

  _reduce(alignment: string, styles: Function) {
    return alignment.split(/\s+/).reduce(
      (style, pos) => ({
        ...style,
        ...styles(pos, this.a, this.w, this.pad)
      }),
      {}
    )
  }
}

function wrapperStyles(pos, a, w, pad) {
  return getStyle(pos, {
    left: () => ({left: a.left}),
    right: () => ({left: a.left - w.width + a.width}),
    top: () => ({top: a.top - w.height - pad}),
    bottom: () => ({top: a.bottom + pad}),
    center: () => ({left: a.left + a.width / 2 - w.width / 2})
  })
}

function pointerStyles(pos, a, w) {
  let width = 32
  return getStyle(pos, {
    center: () => ({left: w.width / 2 - width / 2}),
    right: () => ({right: a.width / 2 - width / 2}),
    left: () => ({left: a.width / 2 - width / 2}),
    top: () => ({top: "100%", transform: "rotate(180deg)"}),
    bottom: () => ({bottom: "100%"})
  })
}

function getStyle(pos, styler) {
  return (styler[pos] && styler[pos]()) || {}
}

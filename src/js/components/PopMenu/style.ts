export function getPopMenuStyles(
  position: string,
  anchorRect: Object,
  wrapperRect: Object,
  pad: number
) {
  let reduce = reducer(position, anchorRect, wrapperRect, pad)

  return {
    wrapper: reduce(wrapperStyler),
    pointer: reduce(pointerStyler)
  }
}

function reducer(position, a, w, pad) {
  return function(styler) {
    let styles = styler(a, w, pad)

    return position.split(/\s+/).reduce(
      (style, pos) => ({
        ...style,
        ...styles[pos]
      }),
      {}
    )
  }
}

function wrapperStyler(a, w, pad) {
  return {
    left: {left: a.left},
    right: {left: a.left - w.width + a.width},
    top: {top: a.top - w.height - pad},
    bottom: {top: a.bottom + pad},
    center: {left: a.left + a.width / 2 - w.width / 2}
  }
}

function pointerStyler(a, w, _pad) {
  let width = 32
  let floor = (n) => Math.max(n, 0)
  return {
    center: {left: w.width / 2 - width / 2},
    right: {right: floor(a.width / 2 - width / 2)},
    left: {left: floor(a.width / 2 - width / 2)},
    top: {top: "99%", transform: "rotate(180deg)"},
    bottom: {bottom: "99%"}
  }
}

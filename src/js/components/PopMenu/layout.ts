import {animatePopMenu} from "./animation"
import {getPopMenuPosition} from "./position"
import {getPopMenuStyles} from "./style"

export function layoutPopMenu(
  anchor: HTMLElement,
  menu: HTMLElement,
  position: string
) {
  const aRect = anchor.getBoundingClientRect()
  const mRect = menu.getBoundingClientRect()
  const pad = 20
  let styles = getPopMenuStyles(position, aRect, mRect, pad)

  const truePosition = getPopMenuPosition(position, {
    ...styles.wrapper,
    width: mRect.width,
    height: mRect.height
  })

  styles = getPopMenuStyles(truePosition, aRect, mRect, pad)

  return {
    wrapperStyle: styles.wrapper,
    pointerStyle: styles.pointer,
    animate: () => animatePopMenu(menu, truePosition)
  }
}

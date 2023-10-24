import {useLayoutEffect, useState} from "react"
import useListener from "src/js/components/hooks/useListener"
import {DialogProps} from "./dialog"
import {CSSProperties} from "react"
import {parsePoint} from "./parse-point"
import {parseMargin} from "./parse-margin"

export function usePosition(dialog: HTMLDialogElement, props: DialogProps) {
  const doc = document.documentElement
  const anchor = props.anchor ?? doc
  const anchorPoint = props.anchorPoint ?? "center center"
  const dialogPoint = props.dialogPoint ?? "center center"
  const dialogMargin = props.dialogMargin ?? "0 0 0 0"
  const keepOnScreen = props.keepOnScreen ?? true
  const [position, setPosition] = useState<CSSProperties>({
    top: 0,
    left: 0,
    position: "fixed",
  })

  const run = () => {
    if (!props.isOpen || !dialog) return
    const anchorRect = anchor.getBoundingClientRect()
    const dialogRect = dialog.getBoundingClientRect()
    dialogRect.width = dialog.clientWidth
    dialogRect.height = dialog.clientHeight
    let left = anchorRect.left
    let top = anchorRect.top
    const leftMin = 0
    const leftMax = doc.clientWidth - leftMin
    const topMin = 0
    const topMax = doc.clientHeight - topMin
    const [anchorX, anchorY] = parsePoint(anchorPoint)
    const [dialogX, dialogY] = parsePoint(dialogPoint)
    const margin = parseMargin(dialogMargin)

    // first we line of the top left to where we want it on the anchor.
    // then we adjust the dialog to that point.
    // then we make sure we don't overflow the window
    switch (anchorX) {
      case "center":
        left = anchorRect.left + anchorRect.width / 2
        break
      case "left":
        left = left + 0
        break
      case "right":
        left = left + anchorRect.width
        break
      default:
        break
    }

    switch (anchorY) {
      case "center":
        top = anchorRect.top + anchorRect.height / 2
        break
      case "top":
        top = top + 0
        break
      case "bottom":
        top = top + anchorRect.height
        break
    }

    // Adjust dialog
    switch (dialogX) {
      case "center":
        left = left - dialogRect.width / 2
        break
      case "left":
        left = left + 0 + margin.left
        break
      case "right":
        left = left - dialogRect.width - margin.right
        break
      default:
        //  handle % and px heres
        break
    }

    switch (dialogY) {
      case "center":
        top = top - dialogRect.height / 2
        break
      case "top":
        top = top + 0 + margin.top
        break
      case "bottom":
        top = top - dialogRect.height - margin.bottom
        break
      default:
        // handle % and px here
        break
    }

    if (keepOnScreen) {
      const {width, height} = dialogRect
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
    setPosition((s) => ({...s, left, top}))
  }

  useLayoutEffect(() => {
    run()
  }, [
    dialog && dialog.open,
    anchor,
    anchorPoint,
    dialogPoint,
    dialogMargin,
    props.isOpen,
    keepOnScreen,
  ])

  useListener(global.window, "resize", run)

  return position
}

import {useEffect, useRef} from "react"
import {clickIsWithinElement} from "./click-is-within-element"
import {DialogProps} from "./dialog"

export function useOutsideClick(dialog: HTMLDialogElement, props: DialogProps) {
  const callback = useRef<(e: globalThis.MouseEvent) => void>(() => {})

  useEffect(() => {
    callback.current = (e: globalThis.MouseEvent) => {
      if (clickIsWithinElement(e, dialog)) return
      props.onOutsideClick && props.onOutsideClick(e)
    }
  }, [dialog, props.onOutsideClick])

  useEffect(() => {
    let tid: any
    const listener = (e: globalThis.MouseEvent) => callback.current(e)
    const add = () => document.addEventListener("mousedown", listener)
    const remove = () => document.removeEventListener("mousedown", listener)

    if (props.isOpen) tid = setTimeout(add)
    return () => {
      clearTimeout(tid)
      remove()
    }
  }, [dialog, props.isOpen])
}

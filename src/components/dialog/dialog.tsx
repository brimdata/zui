import {useEffect, useRef} from "react"
import {usePosition} from "./use-position"
import useListener from "src/js/components/hooks/useListener"

export type DialogProps = {
  isOpen?: boolean
  modal?: boolean
  onClose?: () => void
  children?: any
  className?: string
  anchor?: HTMLElement // defaults to body
  anchorPoint?: string
  dialogPoint?: string
  dialogMargin?: string
  keepOnScreen?: boolean // defaults to true
}

export function Dialog(props: DialogProps) {
  const ref = useRef<HTMLDialogElement>()
  const style = usePosition(ref.current, props)

  useListener(ref.current, "close", props.onClose)

  useEffect(() => {
    const el = ref.current
    el && props.isOpen ? (props.modal ? el.showModal() : el.show()) : el.close()
  }, [props.isOpen])

  return (
    <dialog ref={ref} style={style} className={props.className}>
      {props.children}
    </dialog>
  )
}

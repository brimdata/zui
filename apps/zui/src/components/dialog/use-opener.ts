import {useLayoutEffect} from "react"
import {DialogProps} from "./dialog"

export function useOpener(dialog: HTMLDialogElement, props: DialogProps) {
  useLayoutEffect(() => {
    if (!dialog) return
    if (props.isOpen && !dialog.open) {
      props.modal ? dialog.showModal() : dialog.show()
    } else {
      dialog.close()
    }
  }, [dialog, props.isOpen, props.modal])
}

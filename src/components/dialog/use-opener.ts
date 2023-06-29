import {useEffect} from "react"
import {DialogProps} from "./dialog"

export function useOpener(dialog: HTMLDialogElement, props: DialogProps) {
  useEffect(() => {
    if (!dialog) return
    if (props.isOpen && !dialog.open) {
      props.modal ? dialog.showModal() : dialog.show()
    } else {
      dialog.close()
    }
  }, [props.isOpen, props.modal])
}

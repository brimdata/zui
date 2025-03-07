import {createPortal} from "react-dom"

export function ModalRoot(props: {children: any}) {
  return createPortal(props.children, document.getElementById("modal-root"))
}

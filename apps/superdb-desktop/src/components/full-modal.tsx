import {Ref, forwardRef} from "react"
import {useDialog} from "./use-dialog"
import {enter, exit} from "debut-css"
import {hideModal} from "src/domain/window/handlers"

export function useFullModal() {
  const dialog = useDialog({
    onMount: async () => {
      dialog.showModal()
      enter("full-modal")
    },
    beforeClose: () => exit("full-modal"),
    onClose: () => hideModal(),
  })
  return dialog
}

type Props = {
  children: any
}

export const FullModal = forwardRef(function FullModal(
  props: Props,
  ref: Ref<any>
) {
  return (
    <dialog
      ref={ref}
      className="full-modal size:viewport bg:normal z:2"
      data-debut="full-modal:shrink-in"
      style={
        {
          "--dur": "800ms",
          "--ease": "var(--emphasis-easing)",
          "--scale-from": 1.2,
        } as any
      }
    >
      {props.children}
    </dialog>
  )
})

import {Ref, forwardRef} from "react"
import {useDialog} from "./use-dialog"
import {useDebut} from "src/modules/debut/react"
import {hideModal} from "src/domain/window/handlers"

export function useFullModal() {
  const debut = useDebut("fullmodal")
  const dialog = useDialog({
    onMount: async () => {
      dialog.showModal()
      debut.enter()
    },
    beforeClose: () => debut.exit(),
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
      className="size:viewport bg:normal z:2"
      data-debut="fullmodal:shrink-in"
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

import {Ref, forwardRef} from "react"
import {hideModal} from "src/domain/window/handlers"
import {useDialog} from "./use-dialog"
import {useDebut} from "src/modules/debut/react"

export function usePopoverModal() {
  const debut = useDebut("popover")
  const dialog = useDialog({
    onMount: async () => {
      dialog.showModal()
      debut.enter()
    },
    onClose: async () => {
      await debut.exit()
      hideModal()
    },
  })
  return dialog
}

type Props = {
  children: any
}

export const PopoverModal = forwardRef(function PopoverModal(
  props: Props,
  ref: Ref<any>
) {
  return (
    <dialog
      ref={ref}
      data-debut="popover:overlay"
      className="with-popover size:viewport bg:backdrop z:2"
    >
      <div
        data-debut="popover:drop-in"
        className="bg:normal max-width:fit shadow:l radius:l"
      >
        {props.children}
      </div>
    </dialog>
  )
})

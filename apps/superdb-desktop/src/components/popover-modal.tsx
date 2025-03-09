import {CSSProperties, Ref, forwardRef} from "react"
import {hideModal} from "src/domain/window/handlers"
import {useDialog} from "./use-dialog"
import {enter, exit} from "debut-css"
import classNames from "classnames"

export function usePopoverModal() {
  const dialog = useDialog({
    onMount: async () => {
      dialog.showModal()
      enter("popover")
    },
    beforeClose: () => exit("popover"),
    onClose: () => hideModal(),
  })
  return dialog
}

type Props = {
  children: any
  className?: string
  style?: CSSProperties
}

export const PopoverModal = forwardRef(function PopoverModal(
  props: Props,
  ref: Ref<any>
) {
  return (
    <dialog
      ref={ref}
      data-debut="popover:overlay"
      className="with-popover size:viewport bg:backdrop z:2 box-s"
    >
      <div
        style={props.style}
        data-debut="popover:drop-in"
        className={classNames(
          props.className,
          "width:full bg:normal shadow:l radius:l border:solid h-fit overflow-hidden"
        )}
      >
        {props.children}
      </div>
    </dialog>
  )
})

import {useEffect, useRef} from "react"
import useListener from "src/js/components/hooks/useListener"
import {call} from "src/util/call"
import {transitionsComplete} from "src/util/watch-transition"

type Options = {
  showModalOnMount?: boolean
  showOnMount?: boolean
  waitForTransitions?: boolean
  onClose?: (e: CloseEvent) => any
  onCancel?: () => any
}

export function useDialog(opts: Options = {}) {
  const ref = useRef<HTMLDialogElement>()

  useEffect(() => {
    if (opts.showModalOnMount) {
      ref.current?.showModal()
    } else if (opts.showOnMount) {
      ref.current?.show()
    }
  }, [])

  useListener(ref.current, "close", async (e: CloseEvent) => {
    if (opts.waitForTransitions) {
      await transitionsComplete(e.currentTarget)
    }
    call(opts.onClose, e)
  })

  // The "cancel" does not fire when the dialog is not focused
  // The "keydown" event also doesn't fire if the dialog is not focused
  // Listening for the escape key is more reliable
  useListener(document, "keydown", (e: any) => {
    if (e.key === "Escape") {
      e.preventDefault()
      call(opts.onCancel)
      ref.current?.close()
    }
  })

  return {
    ref,
    close: () => ref.current?.close(),
    showModal: () => ref.current?.showModal(),
    show: () => ref.current?.show(),
  }
}

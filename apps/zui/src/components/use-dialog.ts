import {useCallback, useLayoutEffect, useRef} from "react"
import {call} from "src/util/call"
import {useDocListener} from "src/util/hooks/use-doc-listener"
import {useRefListener} from "src/util/hooks/use-ref-listener"

type Options = {
  onMount?: () => any
  beforeClose?: () => any
  onClose?: (e: CloseEvent) => any
  onCancel?: () => any
}

export function useDialog(opts: Options = {}) {
  const ref = useRef<HTMLDialogElement>()

  async function close() {
    const result = await call(opts.beforeClose)
    if (result === false) return
    ref.current?.close()
  }

  useLayoutEffect(() => {
    call(opts.onMount)
  }, [])

  useRefListener(
    ref,
    "close",
    useCallback((e) => call(opts.onClose, e), [opts.onClose])
  )

  useDocListener(
    "keydown",
    useCallback((e: any) => {
      // The "cancel" does not fire when the dialog is not focused
      // The "keydown" event also doesn't fire if the dialog is not focused
      // Listening for the escape key is more reliable
      if (e.key === "Escape") {
        e.preventDefault()
        call(opts.onCancel)
        close()
      }
    }, [])
  )

  return {
    ref,
    close,
    showModal: () => ref.current?.showModal(),
    show: () => ref.current?.show(),
  }
}

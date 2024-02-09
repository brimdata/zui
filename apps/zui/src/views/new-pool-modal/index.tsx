import forms from "src/components/forms.module.css"
import {H1} from "src/components/h1"
import {useState} from "react"
import {formatError} from "./format-error"
import {PoolForm} from "../pool-form"
import {NewPoolModalController} from "./controller"
import {PopoverModal, usePopoverModal} from "src/components/popover-modal"

export function NewPoolModal() {
  const [error, setError] = useState("")
  const state = {error, setError}
  const modal = usePopoverModal()
  const ctl = new NewPoolModalController(modal.close, state)

  return (
    <PopoverModal ref={modal.ref} className="max-width:measure">
      <div className="box-s">
        <form className={forms.form} onSubmit={(e) => ctl.onSubmit(e)}>
          <div className="stack-3">
            <H1>New Pool</H1>
            <section className="stack-1">
              <PoolForm />
              {error && <div className={forms.error}>{formatError(error)}</div>}
              <div className={forms.submission}>
                <button
                  type="button"
                  onClick={modal.close}
                  className={forms.button}
                >
                  Cancel
                </button>
                <button type="submit" className={forms.submit}>
                  Create
                </button>
              </div>
            </section>
          </div>
        </form>
      </div>
    </PopoverModal>
  )
}

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
        <form onSubmit={(e) => ctl.onSubmit(e)}>
          <h1>New Pool</h1>
          <div className="flow region region-space-l">
            <PoolForm nameInput={{required: true, autoFocus: true}} />
            {error && <div>{formatError(error)}</div>}
          </div>
          <div className="repel">
            <button type="button" onClick={modal.close} className="button">
              Cancel
            </button>
            <button type="submit" className="button submit">
              Create
            </button>
          </div>
        </form>
      </div>
    </PopoverModal>
  )
}

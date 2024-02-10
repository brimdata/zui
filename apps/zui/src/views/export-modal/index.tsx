import React, {useRef} from "react"
import classNames from "classnames"
import forms from "src/components/forms.module.css"
import {H1} from "src/components/h1"
import {ExportModalController} from "./controller"
import {PoolSelect} from "../pool-select"
import {PoolForm} from "../pool-form"
import {FormatSelect} from "../format-select"
import {useExportModalState} from "./state"
import {useShowWhen} from "src/util/hooks/use-show-when"
import {useMemoryForm} from "src/util/hooks/use-memory-form"
import {PopoverModal, usePopoverModal} from "src/components/popover-modal"

export function ExportModal() {
  const popover = usePopoverModal()
  const ctl = new ExportModalController(() => popover.close())
  const state = useExportModalState()
  const ref = useRef<HTMLFormElement>()

  useMemoryForm(ref, "export-form")
  useShowWhen(ref)

  return (
    <PopoverModal ref={popover.ref} className="max-width:fit">
      <div className="stack-3 box-1">
        <H1>Export Results</H1>
        <form
          ref={ref}
          className={classNames(forms.form, "stack-4")}
          onSubmit={(e) => ctl.submit(e)}
        >
          <section className="stack-1 max-width:measure">
            <div className="field">
              <label>Export To</label>
              <div className="cluster">
                <div className={forms.radioInput}>
                  <input
                    type="radio"
                    name="dest"
                    id="dest_file"
                    value="file"
                    defaultChecked
                  ></input>
                  <label htmlFor="dest_file">File</label>
                </div>
                <div className={forms.radioInput}>
                  <input
                    type="radio"
                    name="dest"
                    id="dest_pool"
                    value="pool"
                  ></input>
                  <label htmlFor="dest_pool">Pool</label>
                </div>
              </div>
            </div>
            <div className="stack-1" data-show-when="dest==file">
              <FormatSelect defaultValue="zng" />
            </div>
            <div className="stack-1" data-show-when="dest==pool">
              <PoolSelect
                onChange={(e) => state.setPoolId(e.currentTarget.value)}
              />
              <div className="stack-1" data-show-when="poolId==new">
                <PoolForm nameInput={{required: false, autoFocus: true}} />
              </div>
            </div>
          </section>

          <div className="cluster-3 justify:between width:measure">
            <button
              type="button"
              name="close"
              className={forms.button}
              onClick={() => ctl.close()}
            >
              Close
            </button>

            <button
              data-show-when="dest==pool"
              type="submit"
              name="toPool"
              className={forms.submit}
            >
              Export To Pool
            </button>

            <div className="cluster--1" data-show-when="dest==file">
              <button type="submit" name="toClipboard" className={forms.submit}>
                Copy To Clipboard
              </button>

              <button type="submit" name="toFile" className={forms.submit}>
                Export To File
              </button>
            </div>
          </div>
        </form>
      </div>
    </PopoverModal>
  )
}

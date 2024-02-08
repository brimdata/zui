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
import {useDialog} from "src/components/use-dialog"
import {hideModal} from "src/domain/window/handlers"
import {useDebut} from "src/modules/debut/react"

export function ExportModal() {
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
  const state = useExportModalState()
  const ref = useRef<HTMLFormElement>()
  useMemoryForm(ref, "export-form")
  useShowWhen(ref)

  const ctl = new ExportModalController(() => {
    dialog.close()
  })

  return (
    <dialog
      ref={dialog.ref}
      data-debut="popover:overlay"
      className="with-popover size:viewport bg:backdrop z:2"
    >
      <div
        data-debut="popover:drop-in"
        className="bg:normal max-width:fit shadow:l radius:l"
      >
        <div className="stack-3 box-1" style={{inlineSize: "fit-content"}}>
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
                  <PoolForm />
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
                <button
                  type="submit"
                  name="toClipboard"
                  className={forms.submit}
                >
                  Copy To Clipboard
                </button>

                <button type="submit" name="toFile" className={forms.submit}>
                  Export To File
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  )
}

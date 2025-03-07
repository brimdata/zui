import React, {useRef} from "react"
import {ExportModalController} from "./controller"
import {PoolSelect} from "../pool-select"
import {PoolForm} from "../pool-form"
import {FormatSelect} from "../format-select"
import {useExportModalState} from "./state"
import {
  useDisabledWhen,
  useRequiredWhen,
  useShowWhen,
  useSubmitKey,
} from "src/util/hooks/use-show-when"
import {useMemoryForm} from "src/util/hooks/use-memory-form"
import {PopoverModal, usePopoverModal} from "src/components/popover-modal"
import {Show} from "src/components/show"

export function ExportModal() {
  const popover = usePopoverModal()
  const state = useExportModalState()
  const ctl = new ExportModalController(() => popover.close(), state)
  const ref = useRef<HTMLFormElement>()
  useMemoryForm(ref, "export-form")
  useShowWhen(ref)
  useRequiredWhen(ref)
  useDisabledWhen(ref)
  useSubmitKey(ref)

  return (
    <PopoverModal
      ref={popover.ref}
      style={{maxWidth: "60ch"}}
      className="box gutter-space-m"
    >
      <form ref={ref} onSubmit={(e) => ctl.submit(e)}>
        <header className="flow">
          <h1>Export Results</h1>
          <p>{ctl.summary}</p>
        </header>

        <section className="flow region region-space-xl">
          <label>Export To</label>
          <div className="cluster gap-s">
            <label htmlFor="dest_file">
              <input
                type="radio"
                name="dest"
                id="dest_file"
                value="file"
                defaultChecked
              ></input>
              File
            </label>

            <label htmlFor="dest_pool">
              <input
                type="radio"
                name="dest"
                id="dest_pool"
                value="pool"
              ></input>
              Pool
            </label>
          </div>

          <div className="flow" data-show-when="dest==file">
            <FormatSelect defaultValue="zng" />
          </div>

          <div className="flow" data-show-when="dest==pool">
            <PoolSelect />
            <div className="flow" data-show-when="poolId==new">
              <PoolForm
                nameInput={{
                  autoFocus: true,
                  "data-memory": false,
                  "data-required-when": "poolId==new && dest==pool",
                }}
                keyInput={{
                  "data-memory": false,
                }}
              />
            </div>
          </div>
        </section>

        <footer className="repel">
          <button
            type="button"
            name="close"
            className="button"
            onClick={() => ctl.close()}
          >
            Close
          </button>
          <button
            data-show-when="dest==pool"
            type="submit"
            name="toPool"
            className="button submit"
            data-disabled-when="dest==file"
          >
            Export To Pool
          </button>

          <div className="repel" data-show-when="dest==file">
            <Show when={state.isCopying} delay={150}>
              <p>Copying to Clipboard...</p>
              <button
                type="button"
                className={"button"}
                onClick={ctl.cancelCopyToClipboard}
                data-disabled-when="dest==pool"
              >
                Cancel
              </button>
            </Show>
            <Show when={!state.isCopying} delay={150}>
              <button
                type="submit"
                name="toClipboard"
                className={"button submit"}
                data-disabled-when="dest==pool"
                data-submit-key="CmdOrCtrl+Enter"
              >
                Copy to Clipboard {globalThis.env.isMac ? "⌘" : "^"}↩
              </button>
              <button
                type="submit"
                name="toFile"
                className="button submit"
                data-disabled-when="dest==pool"
                data-submit-key="Enter"
              >
                Export to File ↩
              </button>
            </Show>
          </div>
        </footer>
      </form>
    </PopoverModal>
  )
}

import React from "react"
import {useState} from "react"
import classNames from "classnames"
import forms from "src/components/forms.module.css"
import {H1} from "src/components/h1"
import {ToolbarTabs} from "src/components/toolbar-tabs"
import {ExportModalController} from "./controller"
import {Show} from "src/components/show"
import {PoolSelect} from "../pool-select"
import {PoolForm} from "../pool-form"
import {FormatSelect} from "../format-select"
import {MenuItem} from "src/core/menu"

export function ExportModal({onClose}) {
  const [dest, setDest] = useState("file")
  const [poolId, setPoolId] = useState("new")
  const toPool = dest === "pool"
  const toFile = dest === "file"
  const newPool = poolId === "new"
  const ctl = new ExportModalController(onClose)
  const tabs = [
    {
      label: "File",
      iconName: "file_border",
      checked: dest === "file",
      click: () => setDest("file"),
    },
    {
      label: "Pool",
      iconName: "pool",
      checked: dest == "pool",
      click: () => setDest("pool"),
    },
  ] as MenuItem[]

  return (
    <div className="stack-3 box-1" style={{minWidth: "30rem"}}>
      <H1>Export Results</H1>
      <form
        className={classNames(forms.form, "stack-4")}
        onSubmit={(e) => ctl.submit(e)}
      >
        <section className="stack-1 max-width:measure">
          <div className="field">
            <label>Export To</label>
            <ToolbarTabs style={{blockSize: "35px"}} options={tabs} />
          </div>

          <Show when={toFile}>
            <FormatSelect defaultValue="zng" />
          </Show>

          <Show when={toPool}>
            <PoolSelect onChange={(e) => setPoolId(e.currentTarget.value)} />
            <Show when={newPool}>
              <PoolForm />
            </Show>
          </Show>
        </section>

        <div className="cluster-3 justify:between">
          <button type="button" name="close" className={forms.button}>
            Close
          </button>

          <Show when={toPool}>
            <button type="submit" name="toPool" className={forms.submit}>
              Export To Pool
            </button>
          </Show>

          <Show when={toFile}>
            <div className="cluster--1">
              <button type="submit" name="toClipboard" className={forms.submit}>
                Copy To Clipboard
              </button>

              <button type="submit" name="toFile" className={forms.submit}>
                Export To File
              </button>
            </div>
          </Show>
        </div>
      </form>
    </div>
  )
}

import React from "react"
import {useState} from "react"
import classNames from "classnames"
import forms from "src/components/forms.module.css"
import {H1} from "src/components/h1"
import {ToolbarTabs} from "src/components/toolbar-tabs"
import {preventDefault} from "src/util/prevent-default"
import {ExportModalController} from "./controller"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"
import {ResponseFormat} from "@brimdata/zed-js"
import {Show} from "src/components/show"

export function ExportModal({onClose}) {
  const [format, setFormat] = useState<ResponseFormat>("zng")
  const [dest, setDest] = useState("file")
  const toPool = dest === "pool"
  const toFile = dest === "file"
  const [poolId, setPoolId] = useState(null)
  const pools = useSelector(Current.getPools)
  const ctl = new ExportModalController(format, poolId, onClose)

  return (
    <div className="stack-3 box-1" style={{minWidth: "30rem"}}>
      <H1>Export Results</H1>
      <form
        className={classNames(forms.form, "stack-4")}
        onSubmit={preventDefault}
      >
        <section className="field-stack max-width:measure">
          <div className="field">
            <label>Export To</label>
            <ToolbarTabs
              style={{height: "var(--form-height)"}}
              options={[
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
              ]}
            />
          </div>

          <Show when={toFile}>
            <div className="field">
              <label>Format</label>
              <select
                name="format"
                onChange={(e) => setFormat(e.target.value as any)}
              >
                {ctl.formatOptions.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    selected={opt.value == format}
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </Show>

          <Show when={toPool}>
            <div className="field">
              <label>Pool</label>
              <select
                name="poolId"
                onChange={(e) => setPoolId(e.currentTarget.value)}
              >
                {pools.map((pool) => (
                  <option
                    key={pool.id}
                    value={pool.id}
                    selected={poolId === pool.id}
                  >
                    {pool.name}
                  </option>
                ))}
              </select>
            </div>
          </Show>
        </section>

        <div className="cluster-3 justify:between">
          <button
            type="button"
            onClick={() => ctl.close()}
            className={forms.button}
          >
            Close
          </button>
          <Show when={toPool}>
            <button
              type="submit"
              className={forms.submit}
              onClick={() => ctl.toPool()}
            >
              Export To Pool
            </button>
          </Show>
          <Show when={toFile}>
            <div className="cluster--1">
              <button
                type="submit"
                onClick={() => ctl.toClipboard()}
                className={forms.submit}
              >
                Copy To Clipboard
              </button>
              <button
                type="submit"
                onClick={() => ctl.toFile()}
                className={forms.submit}
              >
                Export To File
              </button>
            </div>
          </Show>
        </div>
      </form>
    </div>
  )
}

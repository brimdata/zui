import React from "react"
import {ChangeEvent, useState} from "react"
import {toast} from "react-hot-toast"
import {invoke} from "src/core/invoke"
import {useZuiApi} from "src/app/core/context"
import {prepExportQuery} from "src/domain/results/utils/prep-export-query"
import classNames from "classnames"
import forms from "src/components/forms.module.css"
import modals from "src/components/modals.module.css"
import {H1} from "src/components/h1"
import {SectionTabs} from "src/components/section-tabs"
import {ToolbarTabs} from "src/components/toolbar-tabs"

const showDialog = (format) => {
  return invoke("showSaveDialogOp", {
    title: `Export Results as ${format.toUpperCase()}`,
    buttonLabel: "Export",
    defaultPath: `results.${format}`,
    properties: ["createDirectory"],
    showsTagField: false,
  })
}

// add default for zng or the last most recent format
const formatOptions = [
  {value: "arrows", label: "Arrow IPC Stream"},
  {value: "csv", label: "CSV"},
  {value: "json", label: "JSON"},
  {value: "ndjson", label: "NDJSON"},
  {value: "tsv", label: "TSV"},
  {value: "vng", label: "VNG"},
  {value: "zeek", label: "Zeek"},
  {value: "zjson", label: "ZJSON"},
  {value: "zng", label: "ZNG"},
  {value: "zson", label: "ZSON"},
]

const ExportModal = ({onClose}) => {
  const api = useZuiApi()
  const [format, setFormat] = useState("zng")
  const [dest, setDest] = useState("file")

  const onExport = async () => {
    const {canceled, filePath} = await showDialog(format)
    if (canceled) return
    const query = prepExportQuery(api, format)
    const promise = invoke("results.export", query, format, filePath)
    toast
      .promise(promise, {
        loading: "Exporting...",
        success: "Export Completed: " + filePath,
        error: "Error Exporting",
      })
      .catch((e) => {
        console.error(e)
      })

    onClose()
  }

  function preventDefault(e) {
    e.preventDefault()
  }

  return (
    <form
      className={classNames(modals.form, forms.form)}
      onSubmit={preventDefault}
    >
      <H1 className={modals.title}>Export Results</H1>
      <section className={forms.fields}>
        <div>
          <label>Export To</label>
          <ToolbarTabs
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
        <div>
          <label>Format</label>
          <select name="format" onChange={(e) => setFormat(e.target.value)}>
            {formatOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </section>
      <div className={classNames(modals.submission, forms.submission)}>
        <button type="button" onClick={onClose} className={forms.button}>
          Close
        </button>
        <button type="submit" onClick={onExport} className={forms.submit}>
          Export
        </button>
      </div>
    </form>
  )
}

export default ExportModal

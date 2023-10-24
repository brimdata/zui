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

const showDialog = (format) => {
  return invoke("showSaveDialogOp", {
    title: `Export Results as ${format.toUpperCase()}`,
    buttonLabel: "Export",
    defaultPath: `results.${format}`,
    properties: ["createDirectory"],
    showsTagField: false,
  })
}

const ExportModal = ({onClose}) => {
  const api = useZuiApi()
  const [format, setFormat] = useState("zng")

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
          <label>Format</label>
          <div
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setFormat(e.target.value)
            }}
          >
            <div className={forms.radioInput}>
              <input type="radio" id="arrows" value="arrows" name="format" />
              <label htmlFor="arrows">Arrow IPC Stream</label>
            </div>
            <div className={forms.radioInput}>
              <input type="radio" id="csv" value="csv" name="format" />
              <label htmlFor="csv">CSV</label>
            </div>
            <div className={forms.radioInput}>
              <input type="radio" id="json" value="json" name="format" />
              <label htmlFor="json">JSON</label>
            </div>
            <div className={forms.radioInput}>
              <input type="radio" id="ndjson" value="ndjson" name="format" />
              <label htmlFor="ndjson">NDJSON</label>
            </div>
            <div className={forms.radioInput}>
              <input type="radio" id="vng" value="vng" name="format" />
              <label htmlFor="vng">VNG</label>
            </div>
            <div className={forms.radioInput}>
              <input type="radio" id="zeek" value="zeek" name="format" />
              <label htmlFor="zeek">Zeek</label>
            </div>
            <div className={forms.radioInput}>
              <input type="radio" id="zjson" value="zjson" name="format" />
              <label htmlFor="zjson">ZJSON</label>
            </div>
            <div className={forms.radioInput}>
              <input
                type="radio"
                id="zng"
                value="zng"
                name="format"
                defaultChecked
              />
              <label htmlFor="zng">ZNG</label>
            </div>
            <div className={forms.radioInput}>
              <input type="radio" id="zson" value="zson" name="format" />
              <label htmlFor="zson">ZSON</label>
            </div>
          </div>
        </div>
      </section>
      <div className={classNames(modals.submission, forms.submission)}>
        <button type="button" onClick={onClose}>
          Close
        </button>
        <button type="submit" onClick={onExport}>
          Export
        </button>
      </div>
    </form>
  )
}

export default ExportModal

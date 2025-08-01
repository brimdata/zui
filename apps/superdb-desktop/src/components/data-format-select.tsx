import React from "react"

export function DataFormatOptions() {
  return (
    <>
      <option value="auto">Auto-detect</option>
      <option value="arrows">Arrow IPC Stream</option>
      <option value="bsup">BSUP</option>
      <option value="csup">CSUP</option>
      <option value="csv">CSV</option>
      <option value="json">JSON</option>
      <option value="jsup">JSUP</option>
      <option value="line">Line</option>
      <option value="parquet">Parquet</option>
      <option value="sup">SUP</option>
      <option value="tsv">TSV</option>
      <option value="zeek">Zeek</option>
    </>
  )
}

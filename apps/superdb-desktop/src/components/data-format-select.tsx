import React from "react"

export function DataFormatOptions() {
  return (
    <>
      <option value="auto">Auto-detect</option>
      <option value="arrows">Arrow IPC Stream</option>
      <option value="csv">CSV</option>
      <option value="json">JSON</option>
      <option value="line">Line</option>
      <option value="parquet">Parquet</option>
      <option value="tsv">TSV</option>
      <option value="vng">VNG</option>
      <option value="zeek">Zeek</option>
      <option value="zjson">ZJSON</option>
      <option value="zng">ZNG</option>
      <option value="zson">ZSON</option>
    </>
  )
}

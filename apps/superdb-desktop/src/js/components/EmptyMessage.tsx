import React from "react"
import classNames from "classnames"

export default function EmptyMessage({show}: {show: boolean}) {
  if (!show) return null
  return <p className={classNames("no-chart-data")}>No Chart Data</p>
}

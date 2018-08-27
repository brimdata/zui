import React from "react"
import AnalysisTable from "./AnalysisTable"

export default class AnalysisViewer extends React.Component {
  render() {
    const {analysis, isFetching} = this.props
    const keys = Object.keys(analysis)

    const tables = keys.map(key => (
      <div key={key} className="analysis-table-wrapper">
        <AnalysisTable data={analysis[key]} />
      </div>
    ))

    return (
      <div className="analysis-viewer">
        {tables}
        {isFetching && <p className="loading-message">Analyzing...</p>}
      </div>
    )
  }
}

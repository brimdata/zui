import React from "react"
import AnalysisTable from "./AnalysisTable"

export default class AnalysisViewer extends React.Component {
  render() {
    const {analysis} = this.props

    return (
      <div className="analysis-viewer">
        <div className="analysis-table-wrapper">
          <AnalysisTable data={analysis} />
        </div>
      </div>
    )
  }
}

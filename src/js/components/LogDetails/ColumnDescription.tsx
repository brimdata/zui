import zeekLogInfo from "src/ppl/zeek/logInfo"
import React from "react"
import ReactMarkdown from "react-markdown"
import {Column} from "../../types"

type Props = {
  column: Column
  path: string
}

export default function ColumnDescription({column, path}: Props) {
  const info = zeekLogInfo(path)
  const col = info.describeColumn(column)

  return (
    <div className="column-description">
      <div className="tip-title">
        <p>{column.name}</p> <p>{col.type}</p>
      </div>
      <div className="tip-body">
        <ReactMarkdown>{col.desc}</ReactMarkdown>
      </div>
      {info.isKnown() && (
        <div className="tip-footer">
          <a onClick={() => global.zui.invoke("openLinkOp", info.docsUrl())}>
            Link to Docs
          </a>
        </div>
      )}
    </div>
  )
}

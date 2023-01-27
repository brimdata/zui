import React from "react"
import {View} from "src/app/features/inspector/views/view"

export const CellValue = React.memo(function CellValue(props: {view: View}) {
  if (!props.view) return null
  const rows = props.view.ctx.rows.map(({indent, render}, i) => {
    return (
      <div
        className="zed-table__line"
        key={i}
        style={{paddingLeft: indent * 16}}
      >
        {render}
      </div>
    )
  })
  return <>{rows}</>
})

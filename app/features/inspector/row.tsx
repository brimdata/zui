import {isEqual} from "lodash"
import React from "react"
import {ComponentType} from "react"
import {ListChildComponentProps} from "react-window"
import {RowData} from "./types"

export const Row: ComponentType<ListChildComponentProps> = React.memo(
  function Row({style, index, data}) {
    if (!data[index]) return null
    const {render, indent}: RowData = data[index]
    const innerStyle = {paddingLeft: 12 * (indent + 1)}

    return (
      <div className="inspector-row" style={{...style, ...innerStyle}}>
        {render}
      </div>
    )
  },
  (prev, next) => {
    return (
      prev.data === next.data &&
      prev.index === next.index &&
      isEqual(prev.style, next.style)
    )
  }
)

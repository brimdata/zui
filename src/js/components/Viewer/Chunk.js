/* @flow */

import React from "react"
import type {Layout} from "./Layout"
import type {RowRenderer} from "./types"
import isEqual from "lodash/isEqual"

type Props = {
  rowRenderer: RowRenderer,
  layout: Layout,
  rows: number[]
}

export default class Chunk extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return (
      !this.props.layout.isEqual(nextProps.layout) ||
      !isEqual(this.props.rows, nextProps.rows)
    )
  }

  render() {
    const {rowRenderer, layout} = this.props
    return <div>{this.props.rows.map(index => rowRenderer(index, layout))}</div>
  }
}

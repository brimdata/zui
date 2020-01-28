/* @flow */

import React from "react"

import type {Column} from "../../types"
import {open} from "../../lib/System"
import Tip from "../Tip"
import brim from "../../brim"

type Props = {
  show: boolean,
  anchor: ?HTMLElement,
  column: Column,
  path: string
}

export default function ColumnDescription({show, anchor, column, path}: Props) {
  let info = brim.zeekLogInfo(path)
  return (
    <Tip show={show} anchor={anchor} className="column-description">
      <div className="tip-title">
        <p>{column.name}</p> <p>{column.type}</p>
      </div>
      <div className="tip-body">
        <p>{info.describeColumn(column.name)}</p>
      </div>
      {info.isKnown() && (
        <div className="tip-footer">
          <a onClick={() => open(info.docsUrl())}>Link to Docs</a>
        </div>
      )}
    </Tip>
  )
}

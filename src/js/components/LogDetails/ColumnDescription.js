/* @flow */

import MarkdownIt from "markdown-it"
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
  let md = new MarkdownIt()
  let {desc, type} = info.describeColumn(column.name)
  const createBody = () => ({
    __html: md.render(desc)
  })

  return (
    <Tip show={show} anchor={anchor} className="column-description">
      <div className="tip-title">
        <p>{column.name}</p> <p>{type}</p>
      </div>
      <div className="tip-body">
        <p dangerouslySetInnerHTML={createBody()}></p>
      </div>
      {info.isKnown() && (
        <div className="tip-footer">
          <a onClick={() => open(info.docsUrl())}>Link to Docs</a>
        </div>
      )}
    </Tip>
  )
}

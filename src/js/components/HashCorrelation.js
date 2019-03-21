/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {Dispatch, DispatchProps} from "../reducers/types"
import InlineTable from "./InlineTable"
import Log from "../models/Log"
import dispatchToProps from "../lib/dispatchToProps"

type Props = {log: Log, dispatch: Dispatch}
type State = {logs: Log[]}

export default class HashCorrelation extends React.Component<Props, State> {
  render() {
    return (
      <div className="hash-correlation">
        <InlineTable
          logs={[
            new Log(
              ["afeif234jivo3j234oji234ij4234i", "23,000"],
              [{type: "string", name: "md5"}, {type: "count", name: "count"}]
            )
          ]}
        />
        <div className="two-column">
          <InlineTable logs={[]} />
          <InlineTable logs={[]} />
        </div>
      </div>
    )
  }
}

export const XHashCorrelation = connect<
  Props,
  {|log: Log|},
  _,
  DispatchProps,
  _,
  _
>(
  null,
  dispatchToProps
)(HashCorrelation)

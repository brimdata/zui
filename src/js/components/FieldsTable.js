/* @flow */

import React from "react"

import {XDetailFieldActions} from "./FieldActions"
import Field from "../models/Field"
import Log from "../models/Log"

type TableProps = {
  log: Log,
  only?: string[]
}

const FieldsTable = ({log, only}: TableProps) => {
  const rows = []
  const {tuple} = log

  if (only) {
    only.forEach(name => {
      const field = log.getField(name)
      if (field) {
        rows.push(<FieldsTableRow key={name} field={field} log={log} />)
      }
    })
  } else {
    for (let index = 0; index < tuple.length; index++) {
      const field = log.getFieldAt(index)
      if (field) {
        if (field.name === "_td") continue
        rows.push(<FieldsTableRow key={field.name} field={field} log={log} />)
      }
    }
  }

  return (
    <table className="fields-table">
      <tbody>{rows}</tbody>
    </table>
  )
}

type RowProps = {
  field: Field,
  log: Log
}

type RowState = {
  showMenu: boolean,
  menuStyle: Object
}

export class FieldsTableRow extends React.Component<RowProps, RowState> {
  state = {
    showMenu: false,
    menuStyle: {top: 0, left: 0}
  }

  onRightClick = (e: MouseEvent) => {
    this.setState({showMenu: true, menuStyle: {top: e.pageY, left: e.pageX}})
  }

  dismissRightClick = () => {
    this.setState({showMenu: false})
  }

  render() {
    return (
      <tr onContextMenu={this.onRightClick}>
        <th>{this.props.field.name}</th>
        <td className={this.props.field.type}>{this.props.field.value}</td>
        {this.state.showMenu && (
          <XDetailFieldActions
            {...this.props}
            style={this.state.menuStyle}
            onClose={this.dismissRightClick}
          />
        )}
      </tr>
    )
  }
}

export default FieldsTable

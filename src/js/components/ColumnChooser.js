/* @flow */

import React from "react"

import {XColumnChooserMenu} from "./ColumnChooserMenu"
import ColumnsIcon from "../icons/ColumnsIcon"
import DropMenu from "./DropMenu"
import ToolbarButton from "./ToolbarButton"

type Props = {}

export default class ColumnChooser extends React.Component<Props> {
  render() {
    return (
      <div className="columns-button" title="Show or hide columns in the table">
        <DropMenu
          position="right-wall"
          value="columns"
          menu={XColumnChooserMenu}
          dim={true}
        >
          <ToolbarButton icon={<ColumnsIcon />} />
          <label>Columns</label>
        </DropMenu>
      </div>
    )
  }
}

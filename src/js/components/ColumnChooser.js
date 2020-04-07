/* @flow */

import React from "react"

import {XColumnChooserMenu} from "./ColumnChooserMenu"
import BrimTooltip from "./BrimTooltip"
import ColumnsIcon from "../icons/ColumnsIcon"
import DropMenu from "./DropMenu"
import ToolbarButton from "./ToolbarButton"

type Props = {}

export default class ColumnChooser extends React.Component<Props> {
  render() {
    return (
      <div className="columns-button">
        <DropMenu
          position="right-wall"
          value="columns"
          menu={XColumnChooserMenu}
          dim={true}
        >
          <div
            data-tip="Show or hide columns in the table."
            data-place="bottom"
            data-effect="solid"
            data-delay-show={500}
            data-for="columns"
          >
            <ToolbarButton icon={<ColumnsIcon />} />
            <label>Columns</label>
            <BrimTooltip id="columns" />
          </div>
        </DropMenu>
      </div>
    )
  }
}

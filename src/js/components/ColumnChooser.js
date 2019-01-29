/* @flow */

import React from "react"
import DropMenu from "./DropMenu"
import {ThinButton} from "./Buttons"
import {XColumnChooserMenu} from "./ColumnChooserMenu"

type Props = {}

export default class ColumnChooser extends React.Component<Props> {
  render() {
    return (
      <div className="column-chooser-wrapper">
        <DropMenu
          position="right-wall"
          value="columns"
          menu={XColumnChooserMenu}
          dim={true}
        >
          <ThinButton>Columns</ThinButton>
        </DropMenu>
      </div>
    )
  }
}

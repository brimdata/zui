/* @flow */

import React from "react"

import {XColumnChooserMenu} from "./ColumnChooserMenu"
import DropMenu from "./DropMenu"
import MenuBarButton from "./MenuBarButton"

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
          <MenuBarButton>Columns</MenuBarButton>
        </DropMenu>
      </div>
    )
  }
}

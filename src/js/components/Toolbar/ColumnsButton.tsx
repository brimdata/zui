import React from "react"

import {XColumnChooserMenu} from "../ColumnChooserMenu"
import Button from "./Button"
import ColumnsIcon from "../../icons/ColumnsIcon"
import DropMenu from "../DropMenu"
import Label from "./Label"

type Props = {}

export default class ColumnChooser extends React.Component<Props> {
  render() {
    return (
      <div className="columns-button" title="Show or hide columns in the table">
        <DropMenu position="right-wall" menu={XColumnChooserMenu} dim={true}>
          <Button icon={<ColumnsIcon />} />
          <Label>Columns</Label>
        </DropMenu>
      </div>
    )
  }
}

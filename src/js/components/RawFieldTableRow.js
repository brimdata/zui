import React from "react"
import ContextMenuButton from "./ContextMenuButton"
import XFieldActionsPopup from "../connectors/XFieldActionsPopup"
import doc from "../doc"

export default class RawFieldTableRow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {selected: false}
    this.openMenu = this.openMenu.bind(this)
    this.closeMenu = this.closeMenu.bind(this)
  }

  openMenu(e) {
    this.setState({selected: true})
    const rect = e.currentTarget.getBoundingClientRect()
    this.menuPosition = {
      top: rect.bottom,
      left: rect.left
    }
    doc.noScroll()
  }

  closeMenu() {
    this.setState({selected: false})
    doc.yesScroll()
  }

  render() {
    const field = this.props.field
    const fieldName = this.props.field.name
    return (
      <tr className={fieldName}>
        <th>{fieldName}</th>
        <td>
          {field.toString()}
          <ContextMenuButton onClick={this.openMenu} />
          {this.state.selected && (
            <XFieldActionsPopup
              field={field}
              style={this.menuPosition}
              onDismiss={this.closeMenu}
            />
          )}
        </td>
      </tr>
    )
  }
}

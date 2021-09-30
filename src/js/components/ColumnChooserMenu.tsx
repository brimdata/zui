import React from "react"
import {connect} from "react-redux"
import {CSSTransition} from "react-transition-group"
import styled from "styled-components"
import dispatchToProps from "../lib/dispatchToProps"
import Columns from "../state/Columns"
import {printColumnName} from "../state/Columns/models/column"
import {TableColumn} from "../state/Columns/types"
import Layout from "../state/Layout"
import {DispatchProps, State} from "../state/types"
import CloseButton from "./CloseButton"
import Checkbox from "./common/Checkbox"
import SearchInput from "./common/forms/SearchInput"
import SelectInput from "./common/forms/SelectInput"
import {Fieldset, Label} from "./Typography"

const ControlListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 12px;
  cursor: default;

  p {
    text-decoration: underline;
    color: var(--havelock);
  }
`

const ColumnListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 12px;
  cursor: default;
  ${(props) => props.theme.typography.labelNormal}
`

const StyledLabel = styled.label`
  ${(props) => props.theme.typography.labelNormal}
`

const StyledSelectInput = styled(SelectInput)`
  width: 60px;
`

const Paragraph = styled.p`
  ${(props) => props.theme.typography.labelSmall}
`

type OwnProps = {
  onClose: () => any
}

type StateProps = ReturnType<typeof stateToProps>

type Props = StateProps & DispatchProps & OwnProps

type LocalState = {
  searchValue: string
}

export default class ColumnChooserMenu extends React.Component<
  Props,
  LocalState
> {
  state: LocalState = {
    searchValue: ""
  }

  tableId() {
    return this.props.tableColumns.id
  }

  allVisible() {
    return this.props.tableColumns.allVisible()
  }

  deselectAllColumns = (e) => {
    e.stopPropagation()
    this.props.dispatch(Columns.hideAllColumns(this.tableId()))
  }

  selectAllColumns = (e) => {
    e.stopPropagation()
    this.props.dispatch(Columns.showAllColumns(this.tableId()))
  }

  onColumnClick(e, column: TableColumn) {
    e.stopPropagation()
    if (column.isVisible) {
      this.props.dispatch(Columns.hideColumn(this.tableId(), column.name))
    } else {
      this.props.dispatch(Columns.showColumn(this.tableId(), column.name))
    }
  }

  handleChange = (event) => {
    this.setState({searchValue: event.currentTarget.value})
  }

  clearSearch = () => {
    this.setState({searchValue: ""})
  }

  render() {
    const {columnHeadersView} = this.props
    const columns = this.props.tableColumns.getColumns()
    const count = this.props.tableColumns.visibleCount()

    const onChangeColumnView = (e) => {
      this.props.dispatch(Layout.setColumnHeadersView(e.target.value))
    }

    return (
      <CSSTransition
        classNames="slide-in-right"
        timeout={{enter: 150, exit: 150}}
        in={true}
        appear
      >
        <div
          className="column-chooser-menu"
          onClick={(e) => e.stopPropagation()}
        >
          <Fieldset>Column Chooser</Fieldset>
          <hr />
          <CloseButton light onClick={this.props.onClose} />
          <div className="count" onClick={this.selectAllColumns}>
            <Label>{count}</Label>
          </div>
          <ul>
            <ControlListItem>
              <StyledLabel>Headers</StyledLabel>
              <StyledSelectInput
                name="Headers"
                value={columnHeadersView}
                onChange={onChangeColumnView}
              >
                <option value="ON">On</option>
                <option value="OFF">Off</option>
                <option value="AUTO">Auto</option>
              </StyledSelectInput>
            </ControlListItem>
            <ControlListItem>
              <Paragraph onClick={this.selectAllColumns}>Select All</Paragraph>
              <Paragraph onClick={this.deselectAllColumns}>
                Deselect All
              </Paragraph>
            </ControlListItem>
            <ControlListItem>
              <div className="search-input">
                <SearchInput
                  autoFocus
                  type="text"
                  value={this.state.searchValue}
                  onChange={this.handleChange}
                />
              </div>
            </ControlListItem>
            {columns
              .filter((c) => {
                if (this.state.searchValue === "") return true
                return (
                  printColumnName(c.name)
                    .toLowerCase()
                    .search(new RegExp(this.state.searchValue, "g")) > -1
                )
              })
              .sort((a, b) => {
                if (a.name < b.name) return -1
                else return 1
              })
              .map((c) => (
                <ColumnListItem key={`${c.name}`}>
                  <Checkbox
                    label={printColumnName(c.name)}
                    checked={c.isVisible}
                    onChange={(e) => this.onColumnClick(e, c)}
                  />
                </ColumnListItem>
              ))}
          </ul>
        </div>
      </CSSTransition>
    )
  }
}

const stateToProps = (state: State) => ({
  tableColumns: Columns.getCurrentTableColumns(state),
  columnHeadersView: Layout.getColumnHeadersView(state)
})

export const XColumnChooserMenu = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  State
>(
  stateToProps,
  dispatchToProps
)(ColumnChooserMenu)

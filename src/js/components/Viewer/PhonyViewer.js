import React from "react"
import ReactDOM from "react-dom"
import LogCell from "../LogCell"
import * as Arr from "../../lib/Array"

export default class PhonyViewer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {mounted: false}
  }

  componentDidMount() {
    this.props.onMount(ReactDOM.findDOMNode(this.ref))
    this.setState({mounted: true})
  }

  render() {
    if (this.state.mounted) return null
    return <Table ref={r => (this.ref = r)} {...this.props} />
  }
}

class Table extends React.Component {
  renderHeaderCell({name}) {
    return <th key={name}>{name}</th>
  }

  renderCell(datum, column, index) {
    const field = datum.getField(column.name)
    if (field) {
      return (
        <td key={`${index}-${column.name}`}>
          <LogCell field={field} log={datum} />
        </td>
      )
    } else {
      return null
    }
  }

  render() {
    const {layout, data} = this.props
    const columns = layout.visibleColumns()
    const headers = <tr>{columns.map(this.renderHeaderCell)}</tr>

    const renderRow = (datum, i) => (
      <tr key={i}>
        {columns.map(column => this.renderCell(datum, column, i))}
      </tr>
    )

    return ReactDOM.createPortal(
      <table className="phony-viewer" ref={r => (this.table = r)}>
        <thead>{headers}</thead>
        <tbody>{Arr.head(data, 10).map(renderRow)}</tbody>
      </table>,

      document.getElementById("measure-layer")
    )
  }
}

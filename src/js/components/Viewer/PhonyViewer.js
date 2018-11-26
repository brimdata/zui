import React from "react"
import ReactDOM from "react-dom"
import LogCell from "../LogCell"

export default class PhonyViewer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {isSampling: false}
    setTimeout(() => this.setState({isSampling: true}))
  }

  componentDidUpdate(_, _prevState) {
    if (this.state.isSampling && this.ref) {
      this.props.onRender(this.ref)
      this.setState({isSampling: false})
    }
  }

  render() {
    if (this.props.data.length === 0) return null
    if (this.state.isSampling)
      return <Table ref={r => (this.ref = r)} {...this.props} />
    else return null
  }
}

class Table extends React.Component {
  render() {
    const {layout, data} = this.props
    const headers = (
      <tr>
        {layout.columns(data[0]).map(col => (
          <th key={col}>{col}</th>
        ))}
      </tr>
    )

    const rows = []
    for (let i = 0; i < 10 && i < data.length; i++) {
      rows.push(
        <tr key={i}>
          {layout.columns(data[0]).map(col => (
            <td key={`${i}-${col}`}>
              <LogCell field={data[i].getField(col)} log={data[i]} />
            </td>
          ))}
        </tr>
      )
    }

    return ReactDOM.createPortal(
      <table className="phony-viewer" ref={r => (this.table = r)}>
        <thead>{headers}</thead>
        <tbody>{rows}</tbody>
      </table>,

      document.getElementById("measure-layer")
    )
  }
}

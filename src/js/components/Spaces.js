import React from "react"
import LookyHeader from "./LookyHeader"
import AdminTitle from "./AdminTitle"
import Plus from "../icons/plus-lg.svg"
import * as fmt from "../fmt"
import {toMoment} from "../cast"
import {Link} from "react-router-dom"

class Spaces extends React.Component {
  constructor(props) {
    super(props)
    this.firstRender = true
  }

  componentDidMount() {
    this.props.fetchAllSpaces()
    this.firstRender = false
  }

  render() {
    if (this.firstRender) return null
    const {spaces, setCurrentSpaceName} = this.props
    const names = Object.keys(spaces)

    if (names.length === 0) return <NoSpaces />

    return (
      <div className="admin-page">
        <LookyHeader />
        <div className="spaces-page-wrapper">
          <header>
            <AdminTitle title="Select a Space" />
            <button className="button-circle">
              <Plus />
            </button>
          </header>

          <ul className="spaces-list">
            {names.map(name => (
              <Link to="/search" key={name}>
                <SpaceInfo
                  space={spaces[name]}
                  onClick={() => setCurrentSpaceName(name)}
                />
              </Link>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

const NoSpaces = () => (
  <div className="admin-page">
    <LookyHeader />
    <div className="no-spaces">
      <p>There are no spaces in this boom instance.</p>
      <button className="button">
        <Plus />
        Create New Space
      </button>
    </div>
  </div>
)

const SpaceInfo = ({
  space: {name, size, compression, min_time, max_time, path},
  onClick
}) => (
  <div className="space-info admin-panel" onClick={onClick}>
    <h3>{name}</h3>
    <table className="admin-table">
      <tbody>
        <tr>
          <th>Size</th>
          <td>{fmt.bytes(size)}</td>
        </tr>
        <tr>
          <th>Compression</th>
          <td>{compression}</td>
        </tr>
        <tr>
          <th>Time Span</th>
          <td>
            {fmt.monthDayYear(toMoment(min_time))} -{" "}
            {fmt.monthDayYear(toMoment(max_time))}
          </td>
        </tr>
        <tr>
          <th>Path</th>
          <td>{path}</td>
        </tr>
      </tbody>
    </table>
  </div>
)

export default Spaces

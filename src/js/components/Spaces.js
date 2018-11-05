/* @flow */

import React from "react"
import LookyHeader from "./LookyHeader"
import AdminTitle from "./AdminTitle"
import Plus from "../icons/plus-lg.svg"
import * as fmt from "../lib/fmt"
import {Redirect} from "react-router-dom"
import * as Time from "../lib/Time"
import type {Space} from "../lib/Space"

type Props = {
  setCurrentSpaceName: Function,
  fetchAllSpaces: Function,
  spaces: {[string]: Space}
}

type State = {
  redirect: boolean
}

class Spaces extends React.Component<Props, State> {
  firstRender: boolean
  onSpaceClick: Function

  constructor(props: Props) {
    super(props)
    this.state = {redirect: false, isFetching: true}
    this.onSpaceClick = name => {
      props.setCurrentSpaceName(name)
      this.setState({redirect: true})
    }
  }

  componentDidMount() {
    this.props.fetchAllSpaces().done(() => {
      this.setState({isFetching: false})
    })
  }

  render() {
    if (this.state.isFetching) return null
    if (this.state.redirect) return <Redirect to="/search" />
    const {spaces} = this.props
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
              <SpaceInfo
                key={name}
                space={spaces[name]}
                onClick={() => this.onSpaceClick(name)}
              />
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

const SpaceInfo = ({space, onClick}) => {
  const dateFormat = "MMM DD, YYYY"
  const {name, size, compression, min_time, max_time, path} = space
  const minTime = Time.parseFromBoom(min_time)
  const maxTime = Time.parseFromBoom(max_time)
  return (
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
              {Time.format(minTime, dateFormat)} -{" "}
              {Time.format(maxTime, dateFormat)}
            </td>
          </tr>
          <tr>
            <th>Path</th>
            <td>{path}</td>
          </tr>
          <tr>
            <th>Packet Support</th>
            <td>{space.packet_support ? "true" : "false"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Spaces

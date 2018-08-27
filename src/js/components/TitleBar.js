import React from "react"

export default class TitleBar extends React.Component {
  constructor(props) {
    super(props)

    this.onHostClick = () => {
      props.disconnectBoomd()
      props.unselectSpace()
    }

    this.onSpaceClick = () => {
      props.unselectSpace()
    }
  }

  render() {
    const {host, port, space} = this.props

    return (
      <div className="title-bar">
        <p onClick={this.onHostClick}>
          {host}:{port}
        </p>
        <p onClick={this.onSpaceClick}>{space}</p>
      </div>
    )
  }
}

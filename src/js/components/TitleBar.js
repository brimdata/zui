import React from "react"
import {PaneHeader, Center, Left, Right, PaneTitle} from "./Pane"

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
        <PaneHeader>
          <Left />
          <Center>
            <PaneTitle>
              <span onClick={this.onHostClick}>
                {host}:{port}
              </span>{" "}
              <span onClick={this.onSpaceClick}>{space}</span>
            </PaneTitle>
          </Center>
          <Right />
        </PaneHeader>
      </div>
    )
  }
}

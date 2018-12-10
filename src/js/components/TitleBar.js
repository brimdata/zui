import React from "react"
import {PaneHeader, Center, Left, Right, PaneTitle} from "./Pane"

export default class TitleBar extends React.Component {
  constructor(props) {
    super(props)

    this.onHostClick = () => {
      props.disconnectBoomd()
    }
  }

  render() {
    const {host, port} = this.props
    return (
      <div className="title-bar">
        <PaneHeader>
          <Left />
          <Center>
            <PaneTitle>
              <span onClick={this.onHostClick}>
                {host}:{port}
              </span>{" "}
            </PaneTitle>
          </Center>
          <Right />
        </PaneHeader>
      </div>
    )
  }
}

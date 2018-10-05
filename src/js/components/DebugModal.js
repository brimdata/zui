/* @flow */

import React from "react"
import Modal from "./Modal"
import {SmallHeading} from "./Headings"
import Prism from "prismjs"

type Props = {
  isOpen: boolean,
  onClose: Function,
  searchProgram: string,
  ast: ?Object
}

export default class DebugModal extends React.Component<Props> {
  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        className="debug-query-modal"
      >
        <SmallHeading>Search Program</SmallHeading>
        <pre>{this.props.searchProgram}</pre>
        <SmallHeading>Abstract Syntax Tree</SmallHeading>
        <pre>
          <code
            className="language-js"
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(
                this.props.ast,
                Prism.languages.js,
                "JSON"
              )
            }}
          />
        </pre>
      </Modal>
    )
  }
}

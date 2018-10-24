/* @flow */

import React from "react"
import {SmallHeading} from "./Headings"
import Prism from "prismjs"
import * as Program from "../lib/Program"

type Props = {
  searchProgram: string
}

type State = {
  program: string
}

export default class DebugModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {program: props.searchProgram}
  }

  render() {
    const [ast, _error] = Program.parse(this.state.program)
    return (
      <div className="debug-query-modal">
        <SmallHeading>Search Program</SmallHeading>

        <input
          className="debug-modal-input"
          type="text"
          value={this.state.program}
          onChange={e => this.setState({program: e.currentTarget.value})}
        />

        <SmallHeading>Abstract Syntax Tree</SmallHeading>
        <pre>
          <code
            className="language-js"
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(
                JSON.stringify(ast, null, 4),
                Prism.languages.js,
                "JSON"
              )
            }}
          />
        </pre>
      </div>
    )
  }
}

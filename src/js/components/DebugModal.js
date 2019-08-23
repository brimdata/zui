/* @flow */

import {connect} from "react-redux"
import Prism from "prismjs"
import React from "react"

import {Code, Label} from "./Typography"
import type {State} from "../state/types"
import * as Program from "../lib/Program"
import * as searchBar from "../state/selectors/searchBar"

type Props = {
  searchProgram: string
}

type LocalState = {
  program: string
}

export default class DebugModal extends React.Component<Props, LocalState> {
  constructor(props: Props) {
    super(props)
    this.state = {program: props.searchProgram}
  }

  render() {
    const [ast, error] = Program.parse(this.state.program)

    let result
    if (ast) {
      result = Prism.highlight(
        JSON.stringify(ast, null, 4),
        Prism.languages.js,
        "JSON"
      )
    } else if (error) {
      result = error.toString()
    }

    return (
      <div className="debug-query-modal">
        <Label>Search Program</Label>
        <div className="text-input-wrapper">
          <input
            className="debug-modal-input"
            type="text"
            value={this.state.program}
            onChange={(e) => this.setState({program: e.currentTarget.value})}
          />
        </div>

        <Label>Abstract Syntax Tree</Label>
        <Code full light>
          <code
            className="language-js"
            dangerouslySetInnerHTML={{__html: result}}
          />
        </Code>
      </div>
    )
  }
}

const stateToProps = (state: State) => ({
  searchProgram: searchBar.getSearchProgram(state)
})

export const XDebugModal = connect<Props, {}, _, _, _, _>(stateToProps)(
  DebugModal
)

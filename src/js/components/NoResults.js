/* @flow */

import React from "react"

import {Fieldset} from "./Typography"

type Props = {}

export default class NoResults extends React.Component<Props> {
  render() {
    return (
      <div className="no-results">
        <Fieldset>No Result Data</Fieldset>
      </div>
    )
  }
}

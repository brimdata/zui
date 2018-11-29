/* @flow */

import React from "react"

type Props = {}

export default class NoResults extends React.Component<Props> {
  render() {
    return (
      <div className="no-results">
        <h3>No results</h3>
      </div>
    )
  }
}

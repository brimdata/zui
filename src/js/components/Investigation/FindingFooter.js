/* @flow */
import React from "react"

import type {Finding} from "../../state/reducers/investigation"
import {Stats} from "../Typography"
import {humanDuration} from "../../lib/TimeWindow"
import {isNumber} from "../../lib/is"
import {withCommas} from "../../lib/fmt"

type Props = {finding: Finding}

export default function FindingFooter({finding}: Props) {
  return (
    <div className="footer">
      {isNumber(finding.resultCount) ? (
        <Stats>{withCommas(finding.resultCount)} results</Stats>
      ) : (
        <Stats>...</Stats>
      )}
      <Stats>•</Stats>
      <Stats>{humanDuration([finding.ts, new Date()])} ago</Stats>
    </div>
  )
}

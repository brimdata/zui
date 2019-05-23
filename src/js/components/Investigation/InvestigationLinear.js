/* @flow */

import React from "react"

import {getKey, sameSpan} from "../../lib/finding"
import {useFindings} from "./useFindings"
import AnimateChildren from "../AnimateChildren"
import FindingCard from "./FindingCard"
import FindingSpanCard from "./FindingSpanCard"

export default React.memo<{}>(function InvestigationLinear() {
  let findings = useFindings()

  let cards = []

  findings.forEach((f, i) => {
    cards.push(<FindingCard index={i} key={getKey(f)} finding={f} />)
    if (!sameSpan(f, findings[i + 1])) {
      let key = JSON.stringify(f.search.span) + (findings.length - i)
      cards.push(<FindingSpanCard key={key} span={f.search.span} />)
    }
  })

  return (
    <AnimateChildren className="investigation-linear">{cards}</AnimateChildren>
  )
})

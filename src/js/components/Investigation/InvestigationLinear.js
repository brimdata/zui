/* @flow */

import {isEqual} from "lodash"
import {useSelector} from "react-redux"
import React, {useMemo} from "react"

import {getInvestigation} from "../../state/reducers/investigation"
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

function getKey(finding) {
  return finding.ts.getTime().toString()
}

function useFindings() {
  let findings = useSelector(getInvestigation)
  return useMemo(() => {
    return [...findings].sort((a, b) => (a.ts < b.ts ? 1 : -1))
  }, [findings])
}

function sameSpan(a, b) {
  if (!b) return false
  return isEqual(a.search.span, b.search.span)
}

/* @flow */

import {isEqual} from "lodash"
import {useSelector} from "react-redux"
import React, {useMemo} from "react"

import {getInvestigation} from "../../state/reducers/investigation"
import FindingCard from "./FindingCard"
import FindingSpanCard from "./FindingSpanCard"

export default function InvestigationLinear() {
  let findings = useSelector(getInvestigation)
  let sorted = useMemo(() => {
    return [...findings].sort((a, b) => (a.ts < b.ts ? 1 : -1))
  }, [findings])

  function sameSpan(a, b) {
    if (!b) return false
    return isEqual(a.search.span, b.search.span)
  }

  let cards = []
  sorted.forEach((f, i) => {
    cards.push(
      <FindingCard index={i} key={f.ts.getTime().toString()} finding={f} />
    )
    if (!sameSpan(f, sorted[i + 1])) {
      cards.push(
        <FindingSpanCard
          key={f.ts.getTime().toString() + "1"}
          span={f.search.span}
        />
      )
    }
  })

  return <div className="investigation-linear">{cards}</div>
}

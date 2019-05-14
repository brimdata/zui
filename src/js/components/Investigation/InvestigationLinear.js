/* @flow */

import {isEqual} from "lodash"
import {useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import {getInvestigation} from "../../state/reducers/investigation"
import {getSearchRecord} from "../../state/selectors/searchRecord"
import FindingCard from "./FindingCard"
import FindingSpanCard from "./FindingSpanCard"

export default function InvestigationLinear() {
  let [key, setKey] = useState(0)
  let findings = useSelector(getInvestigation)
  let currentSearch = useSelector(getSearchRecord)

  function refresh() {
    setKey((key += 1))
    setTimeout(refresh, 60000)
  }

  useEffect(() => {
    setTimeout(refresh, 60000)
  }, [])

  let sorted = [...findings]
  sorted.sort((a, b) => (a.ts < b.ts ? 1 : -1))

  function sameSpan(a, b) {
    if (!b) return false
    return isEqual(a.search.span, b.search.span)
  }

  let cards = []
  sorted.forEach((f, i) => {
    cards.push(
      <FindingCard
        key={f.ts.getTime().toString()}
        finding={f}
        active={isEqual(currentSearch, f.search)}
      />
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

  return (
    <div key={key} className="investigation-linear">
      {cards}
    </div>
  )
}

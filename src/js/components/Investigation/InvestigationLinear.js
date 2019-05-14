/* @flow */

import {isEqual} from "lodash"
import {useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import {getInvestigation} from "../../state/reducers/investigation"
import {getSearchRecord} from "../../state/selectors/searchRecord"
import FindingCard from "./FindingCard"

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

  let cards = sorted.map((f) => (
    <FindingCard
      key={f.ts.getTime().toString()}
      finding={f}
      active={isEqual(currentSearch, f.search)}
    />
  ))

  return (
    <div key={key} className="investigation-linear">
      {cards}
    </div>
  )
}

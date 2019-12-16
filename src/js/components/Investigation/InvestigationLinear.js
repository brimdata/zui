/* @flow */

import React from "react"

import {getKey} from "../../lib/finding"
import {useFindings} from "./useFindings"
import AnimateChildren from "../AnimateChildren"
import FindingCard from "./FindingCard"

export default React.memo<{}>(function InvestigationLinear() {
  let findings = useFindings()

  let cards = []

  findings.forEach((f, i) => {
    cards.push(<FindingCard index={i} key={getKey(f)} finding={f} />)
  })

  return (
    <AnimateChildren className="investigation-linear">{cards}</AnimateChildren>
  )
})

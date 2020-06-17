/* @flow */

import React from "react"

import {getKey} from "../../lib/finding"
import {useFindings} from "./useFindings"
import AnimateChildren from "../AnimateChildren"
import FindingCard from "./FindingCard"
import EmptySection from "../common/EmptySection"
import BookIcon from "../../icons/BookSvgIcon"

export default React.memo<{}>(function InvestigationLinear() {
  let findings = useFindings()

  let cards = []

  findings.forEach((f, i) => {
    cards.push(<FindingCard index={i} key={getKey(f)} finding={f} />)
  })

  if (cards.length === 0)
    return (
      <EmptySection
        icon={<BookIcon />}
        message="As you search through your data, your history will appear here."
      />
    )

  return (
    <AnimateChildren className="investigation-linear">{cards}</AnimateChildren>
  )
})

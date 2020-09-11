import React from "react"

import {getKey} from "../../lib/finding"
import {useFindings} from "./useFindings"
import AnimateChildren from "../AnimateChildren"
import FindingCard from "./FindingCard"
import EmptySection from "../common/EmptySection"
import BookIcon from "../../icons/BookSvgIcon"

export default React.memo<{}>(function InvestigationLinear() {
  const findings = useFindings()

  const cards = []

  findings.forEach((f) => {
    cards.push(<FindingCard key={getKey(f)} finding={f} />)
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

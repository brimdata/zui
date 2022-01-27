import React from "react"
import {useSelector} from "react-redux"
import BookIcon from "../../icons/BookSvgIcon"
import {getKey} from "../../lib/finding"
import Current from "../../state/Current"
import AnimateChildren from "../AnimateChildren"
import EmptySection from "../common/EmptySection"
import FindingCard from "./FindingCard"
import {useFindings} from "./useFindings"

export default React.memo<{}>(function InvestigationLinear() {
  const findings = useFindings()
  const lakeId = useSelector(Current.getLakeId)
  const poolId = useSelector(Current.getPoolId)

  const cards = []

  findings.forEach((f) => {
    cards.push(
      <FindingCard
        key={getKey(f)}
        finding={f}
        lakeId={lakeId}
        poolId={poolId}
      />
    )
  })

  if (cards.length === 0)
    return (
      <EmptySection
        icon={<BookIcon />}
        message="As you search through your data, your history will appear here."
      />
    )

  return <AnimateChildren>{cards}</AnimateChildren>
})

import {useMemo} from "react"

import {useSelector} from "react-redux"
import Investigation from "../../state/Investigation"
import brim from "../../brim"

export function useFindings() {
  let findings = useSelector(Investigation.getInvestigation)
  return useMemo(() => {
    return [...findings].sort((a, b) =>
      brim.time(a.ts).toDate() < brim.time(b.ts).toDate() ? 1 : -1
    )
  }, [findings])
}

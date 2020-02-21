/* @flow */
import {useMemo} from "react"

import {useGlobalSelector} from "../../state/GlobalContext"
import Investigation from "../../state/Investigation"
import brim from "../../brim"

export function useFindings() {
  let findings = useGlobalSelector(Investigation.getInvestigation)
  return useMemo(() => {
    return [...findings].sort((a, b) =>
      brim.time(a.ts).toDate() < brim.time(b.ts).toDate() ? 1 : -1
    )
  }, [findings])
}

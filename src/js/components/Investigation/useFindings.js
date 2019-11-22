/* @flow */
import {useMemo} from "react"
import {useSelector} from "react-redux"

import {getInvestigation} from "../../state/reducers/investigation"
import brim from "../../brim"

export function useFindings() {
  let findings = useSelector(getInvestigation)
  return useMemo(() => {
    return [...findings].sort((a, b) =>
      brim.time(a.ts).toDate() < brim.time(b.ts).toDate() ? 1 : -1
    )
  }, [findings])
}

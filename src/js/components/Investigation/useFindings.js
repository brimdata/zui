/* @flow */
import {useMemo} from "react"
import {useSelector} from "react-redux"

import {getInvestigation} from "../../state/reducers/investigation"

export function useFindings() {
  let findings = useSelector(getInvestigation)
  return useMemo(() => {
    return [...findings].sort((a, b) => (a.ts < b.ts ? 1 : -1))
  }, [findings])
}

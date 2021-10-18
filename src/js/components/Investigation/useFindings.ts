import {useMemo} from "react"
import {useSelector} from "react-redux"
import brim from "../../brim"
import Investigation from "../../state/Investigation"

export function useFindings() {
  const findings = useSelector(Investigation.getCurrentHistory)

  return useMemo(() => {
    return [...findings].sort((a, b) =>
      brim.time(a.ts).toDate() < brim.time(b.ts).toDate() ? 1 : -1
    )
  }, [findings])
}

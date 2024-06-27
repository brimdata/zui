import {useMember} from "./use-member"
import {useTimeout} from "./use-timeout"

export function useAfterDelayOf() {
  const timeout = useTimeout()
  const [satisfied, setSatisfied] = useMember(false)

  return function afterDelayOf(ms: number, fn: () => void) {
    if (satisfied()) {
      fn()
    } else {
      timeout(() => setSatisfied(true), ms)
    }
    setSatisfied(false)
  }
}

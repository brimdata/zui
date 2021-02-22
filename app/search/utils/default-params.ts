import {BrimSpace} from "src/js/brim"
import {SpanArgs} from "src/js/state/Search/types"

export function mergeDefaultSpanArgs(
  spanArgs: Partial<SpanArgs>,
  space: BrimSpace
): SpanArgs {
  const [from, to] = spanArgs
  if (!from && !to) return space.everythingSpan()
  if (!from) return [space.minTs(), to]
  if (!to) return [from, space.maxTs()]
  return [from, to]
}

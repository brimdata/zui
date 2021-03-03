import {BrimSpace} from "src/js/brim"
import {SpanArgs} from "src/js/state/Search/types"

export function mergeDefaultSpanArgs(
  spanArgs: Partial<SpanArgs>,
  space: BrimSpace
): SpanArgs {
  const [from, to] = spanArgs
  const [d1, d2] = space.defaultSpanArgs() as SpanArgs
  return [from || d1, to || d2]
}

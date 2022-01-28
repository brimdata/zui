import {Pool} from "app/core/pools/pool"
import {SpanArgs} from "src/js/state/Search/types"

export function mergeDefaultSpanArgs(
  spanArgs: Partial<SpanArgs>,
  pool: Pool
): SpanArgs {
  if (!pool.hasSpan()) return null
  const defaults = pool.defaultSpanArgs()
  if (!spanArgs) {
    return defaults
  } else {
    const [a, b] = spanArgs
    const [a1, b1] = defaults
    return [a || a1, b || b1]
  }
}

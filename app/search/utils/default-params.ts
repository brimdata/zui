import {Pool} from "app/core/pools/pool"
import {SpanArgs} from "src/js/state/Search/types"

export function mergeDefaultSpanArgs(
  spanArgs: Partial<SpanArgs>,
  pool: Pool
): SpanArgs {
  if (pool.hasSpan()) {
    return pool.defaultSpanArgs()
  } else {
    return null
  }
}

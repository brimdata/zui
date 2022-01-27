import {Pool} from "app/core/pools/pool"
import {SpanArgs} from "src/js/state/Search/types"

export function mergeDefaultSpanArgs(
  _spanArgs: Partial<SpanArgs>,
  pool: Pool
): SpanArgs {
  return pool.defaultSpanArgs()
}

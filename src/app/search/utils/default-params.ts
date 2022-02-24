import {Pool} from "src/app/core/pools/pool"
import brim from "src/js/brim"
import {SpanArgs, TimeArg} from "src/js/state/Search/types"

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
    return [isValid(a) ? a : a1, isValid(b) ? b : b1]
  }
}

function isValid(arg: TimeArg) {
  try {
    return brim.time(arg).isValid()
  } catch {
    return false
  }
}

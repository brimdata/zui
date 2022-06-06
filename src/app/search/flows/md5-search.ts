import {ResultStream} from "@brimdata/zealot"
import querySearch from "src/app/query-home/flows/search"
import {parallelizeProcs} from "src/js/lib/Program"
import {
  filenameCorrelation,
  md5Correlation,
  rxHostsCorrelation,
  txHostsCorrelation,
} from "src/js/searches/programs"
import Current from "src/js/state/Current"
import {Thunk} from "src/js/state/types"

const id = "Md5"

export const md5Search = (md5: string): Thunk<Promise<ResultStream>> => {
  return (dispatch, getState) => {
    const poolId = Current.getQueryPool(getState())?.id
    if (!poolId) return
    const q = parallelizeProcs([
      filenameCorrelation(md5),
      md5Correlation(md5),
      rxHostsCorrelation(md5),
      txHostsCorrelation(md5),
    ])

    return dispatch(
      querySearch({
        query: `from ${poolId} | ${q}`,
        id,
      })
    )
  }
}

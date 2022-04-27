import {ResultStream} from "@brimdata/zealot"
import {search} from "src/js/flows/search/mod"
import querySearch from "src/app/query-home/flows/search"
import {parallelizeProcs} from "src/js/lib/Program"
import {
  filenameCorrelation,
  md5Correlation,
  rxHostsCorrelation,
  txHostsCorrelation,
} from "src/js/searches/programs"
import Current from "src/js/state/Current"
import Tab from "src/js/state/Tab"
import {Thunk} from "src/js/state/types"
import {featureIsEnabled} from "../../core/feature-flag"
import {BrimQuery} from "../../query-home/utils/brim-query"

const id = "Md5"

const legacyMd5Search =
  (md5: string): Thunk<Promise<ResultStream>> =>
  (dispatch, getState) => {
    const poolId = Current.getPoolId(getState())
    if (!poolId) return
    const [from, to] = Tab.getSpanAsDates(getState())
    const q = parallelizeProcs([
      filenameCorrelation(md5),
      md5Correlation(md5),
      rxHostsCorrelation(md5),
      txHostsCorrelation(md5),
    ])

    return dispatch(search({id, query: q, from, to, poolId}))
  }

export const md5Search = (md5: string): Thunk<Promise<ResultStream>> => {
  if (!featureIsEnabled("query-flow")) return legacyMd5Search(md5)
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
        query: new BrimQuery({
          id: "",
          name: "",
          value: q,
          pins: [{type: "from", value: poolId}],
        }),
      })
    )
  }
}

import {Collector, ResultStream} from "@brimdata/zealot"
import {Thunk} from "src/js/state/types"
import ZuiApi from "../zui-api"

export type QueryOptions = {
  id?: string
  tabId?: string
  collect?: Collector
}

export function query(
  body: string,
  opts: QueryOptions = {}
): Thunk<Promise<ResultStream>> {
  return async (d, gs, {api}) => {
    const zealot = await api.getZealot()
    const [signal, cleanup] = createAbortable(api, opts.tabId, opts.id)
    let res: ResultStream
    try {
      res = await zealot.query(body, {signal})
      if (opts.collect) await res.collect(opts.collect)
    } finally {
      cleanup()
    }
    return res
  }
}

function createAbortable(api: ZuiApi, tab?: string, tag?: string) {
  api.abortables.abort({tab, tag})
  const ctl = new AbortController()
  const id = api.abortables.add({abort: () => ctl.abort(), tab, tag})
  const cleanup = () => api.abortables.remove(id)
  return [ctl.signal, cleanup] as const
}

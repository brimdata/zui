import {useDispatch} from "src/app/core/state"
import {run, nextPage} from "./run"
import {useMemo} from "react"
import {useResults} from "./use-results"

export function useQuery(opts: {id: string; query?: string}) {
  const dispatch = useDispatch()
  const query = useMemo(
    () => ({
      run: () => dispatch(run(opts)),
      nextPage: () => dispatch(nextPage(opts.id)),
    }),
    [opts.id, opts.query]
  )
  const results = useResults(opts.id)

  return [query, results] as const
}

import {useDispatch} from "src/app/core/state"
import {firstPage, nextPage} from "./run"
import {useCallback} from "react"

export function useRun(opts: {id: string; query: string}) {
  const dispatch = useDispatch()
  return useCallback(() => dispatch(firstPage(opts)), [opts.id, opts.query])
}

export function useNextPage(id: string) {
  const dispatch = useDispatch()
  return useCallback(() => dispatch(nextPage(id)), [id])
}

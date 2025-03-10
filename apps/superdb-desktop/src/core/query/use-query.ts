import {useDispatch} from "src/core/use-dispatch"
import {nextPage} from "./run"
import {useCallback} from "react"

export function useNextPage(id: string) {
  const dispatch = useDispatch()
  return useCallback(() => dispatch(nextPage(id)), [id])
}

import {useEffect} from "react"
import {useDispatch} from "src/app/core/state"
import Handlers from "src/js/state/Handlers"

export function useHandlersCleanup() {
  const dispatch = useDispatch()
  useEffect(() => {
    return () => {
      dispatch(Handlers.abortAll())
    }
  }, [])
}

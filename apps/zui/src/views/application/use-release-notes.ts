import {useEffect} from "react"
import {useDispatch} from "src/core/use-dispatch"
import {maybeShowReleaseNotes} from "src/views/release-notes/maybe-show-release-notes"

export function useReleaseNotes() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(maybeShowReleaseNotes())
  }, [])
}

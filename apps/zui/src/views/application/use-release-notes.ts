import {useEffect} from "react"
import {useDispatch} from "src/app/core/state"
import {maybeShowReleaseNotes} from "src/app/release-notes/maybe-show-release-notes"

export function useReleaseNotes() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(maybeShowReleaseNotes())
  }, [])
}

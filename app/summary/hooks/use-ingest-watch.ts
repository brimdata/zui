import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import Current from "src/js/state/Current"
import Ingest from "src/js/state/Ingest"
import Search from "src/js/state/Search"

export default function useIngestWatch() {
  const dispatch = useDispatch()
  const snapshot = useSelector(Ingest.getSnapshot)
  const space = useSelector(Current.mustGetSpace)

  useEffect(() => {
    dispatch(Search.setSpan(space.everythingSpan()))
    dispatch(Search.setSpanArgs(space.everythingSpan()))
  }, [snapshot])
}

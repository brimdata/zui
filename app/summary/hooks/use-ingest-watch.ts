import {useEffect} from "react"
import {useSelector} from "react-redux"
import {useHistory} from "react-router"
import Current from "src/js/state/Current"
import Ingest from "src/js/state/Ingest"

export default function useIngestWatch() {
  const snapshot = useSelector(Ingest.getSnapshot)
  const space = useSelector(Current.mustGetSpace)
  const history = useHistory()

  useEffect(() => {
    /**
     * During ingest we show the default span which is everything.
     * Each time more data comes in (snapshot increments), reload
     * the current location which will cause the tiles to update.
     */
    history.replace(history.location)
  }, [snapshot, JSON.stringify(space.everythingSpan())])
}

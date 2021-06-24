import {decodeSearchParams} from "app/search/utils/search-params"
import {useEffect, useState} from "react"
import {useSelector} from "react-redux"
import {useHistory} from "react-router"
import Current from "src/js/state/Current"

export default function useCommitWatch() {
  const pool = useSelector(Current.mustGetPool)
  const size = pool.size
  const fullSpan = JSON.stringify(pool.everythingSpan())
  const history = useHistory()
  const nowIngesting = pool.ingesting()
  const [prevSize, setPrevSize] = useState(size)
  const [prevFullSpan, setPrevFullSpan] = useState(fullSpan)

  useEffect(() => {
    setPrevSize(size)
    setPrevFullSpan(fullSpan)
    if (!nowIngesting) {
      const {spanArgs: currentSpan} = decodeSearchParams(
        history.location.search
      )
      if (size !== prevSize) {
        console.log("updated required!")

        const [from, to] = currentSpan
        if (!from || !to) {
          console.log(
            "empty search, prompt for update which will use new full span"
          )

          return
        }

        if (JSON.stringify(currentSpan) === prevFullSpan) {
          console.log(
            "full span search, prompt for update which will use new full span"
          )
          return
        }

        console.log(
          "non full span on prev search, prompt for update using same user set span"
        )
      }
      return
    }
  }, [fullSpan, size])
}

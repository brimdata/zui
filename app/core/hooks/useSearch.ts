import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {search} from "src/js/flows/search/mod"
import Current from "src/js/state/Current"
import {AppDispatch} from "src/js/state/types"
import {zng} from "zealot"

type R = [zng.Record[], boolean]

export default function useSearch(query: string, deps?: any[]): R {
  const dispatch = useDispatch<AppDispatch>()
  const [records, setRecords] = useState<zng.Record[]>([])
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const space = useSelector(Current.mustGetSpace)

  useEffect(() => {
    if (!space.empty()) {
      setIsFetching(true)
      console.log(`SEARCH: ${query}`)
      const {response, abort} = dispatch(search({query}))
      response.chan(0, (records) => setRecords(records))
      response.status((status) => setIsFetching(status === "FETCHING"))
      return abort
    } else {
      console.log("SEARCH: (space is empty, no search)")
    }
  }, deps)

  return [records, isFetching]
}

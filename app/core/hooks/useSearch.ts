import {useEffect, useState} from "react"
import {useDispatch} from "react-redux"
import {search} from "src/js/flows/search/mod"
import {AppDispatch} from "src/js/state/types"
import {zed} from "@brimdata/zealot"

type R = [zed.Record[], boolean]

export default function useSearch(query: string, deps?: any[]): R {
  const dispatch = useDispatch<AppDispatch>()
  const [records, setRecords] = useState<zed.Record[]>([])
  const [isFetching, setIsFetching] = useState<boolean>(true)

  useEffect(() => {
    setIsFetching(true)
    // TODO
    // const res = dispatch(search({query}))

    // response.chan(0, ({rows}) => setRecords(rows))
    // response.status((status) => {
    //   if (status === "ABORTED") return
    //   setIsFetching(status === "FETCHING")
    // })
    // return abort
  }, deps)

  return [records, isFetching]
}

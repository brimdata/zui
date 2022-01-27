import {zed} from "@brimdata/zealot"
import {useEffect, useState} from "react"
import {useDispatch} from "react-redux"
import {AppDispatch} from "src/js/state/types"

type R = [zed.Record[], boolean]

export default function useSearch(query: string, deps?: any[]): R {
  const _dispatch = useDispatch<AppDispatch>()
  const [records, _setRecords] = useState<zed.Record[]>([])
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

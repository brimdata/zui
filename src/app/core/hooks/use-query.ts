import {ResultStream, zed} from "@brimdata/zealot"
import {useEffect, useState} from "react"
import {QueryOptions} from "src/js/api/core/query"
import {useBrimApi} from "../context"

type R = [zed.Value[], boolean]

export default function useQuery(
  query: string,
  opts: QueryOptions = {},
  deps?: any[]
): R {
  const api = useBrimApi()
  const [rows, setRows] = useState<zed.Value[]>([])
  const [isFetching, setIsFetching] = useState<boolean>(true)

  useEffect(() => {
    setIsFetching(true)
    let res: ResultStream

    api
      .query(query, opts)
      .then((r) => {
        res = r
        return res.collect(({rows}) => {
          setRows(rows)
        })
      })
      .finally(() => {
        setIsFetching(false)
      })

    return () => res?.abort()
  }, deps)

  return [rows, isFetching]
}

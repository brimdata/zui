import {ResultStream, zed} from "@brimdata/zealot"
import {useEffect, useState} from "react"
import {useDispatch} from "react-redux"
import {search} from "src/js/flows/search/mod"
import {AppDispatch} from "src/js/state/types"

type R = [zed.Value[], boolean]

export default function useSearch(query: string, deps?: any[]): R {
  const dispatch = useDispatch<AppDispatch>()
  const [rows, setRows] = useState<zed.Value[]>([])
  const [isFetching, setIsFetching] = useState<boolean>(true)

  useEffect(() => {
    setIsFetching(true)
    let res: ResultStream

    dispatch(search({query}))
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

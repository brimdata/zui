import {nanoid} from "@reduxjs/toolkit"

import {useCallback, useRef, useState, useTransition} from "react"
import {errorToString} from "src/util/error-to-string"
import {useMemoObject} from "src/util/hooks/use-memo-object"
import {isAbortError} from "src/util/is-abort-error"
import {useResultsDisplay} from "./use-results-display"
import * as zed from "@brimdata/zed-js"
import {invoke} from "src/core/invoke"

export function useZq(files: string[], format: zed.LoadFormat) {
  const [_, start] = useTransition()
  const [error, setError] = useState("")
  const [data, setData] = useState<zed.Value[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const display = useResultsDisplay()
  const lastId = useRef(null)

  const query = useCallback(
    (script: string) => {
      const invokeId = nanoid()
      lastId.current = invokeId

      setIsLoading(true)
      invoke("loads.preview", files, script, format, invokeId)
        .then(({error, data, id}) => {
          if (lastId.current !== id) return

          start(() => {
            setIsLoading(false)
            setData(zed.decode(data as any[]))
            if (!isAbortError(error)) setError(errorToString(error))
          })
        })
        .catch((e) => {
          setIsLoading(false)
          setError(errorToString(e))
        })

      return () => {
        setIsLoading(false)
        invoke("loads.abortPreview", invokeId)
      }
    },
    [files, format]
  )

  return useMemoObject({error, data, query, display, isLoading})
}

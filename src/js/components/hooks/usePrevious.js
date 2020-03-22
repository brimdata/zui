/* @flow */
import {useEffect, useState} from "react"

export default function usePrevious(val: *, keys: *) {
  let [prev, setPrev] = useState(val)

  useEffect(() => {
    setPrev(val)
  }, keys)

  return prev
}

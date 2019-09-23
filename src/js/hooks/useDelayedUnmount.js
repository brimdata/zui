/* @flow */
import {useLayoutEffect, useState} from "react"

export default function useDelayedUnmount(shouldMount: boolean, delay: number) {
  let [mounted, setMounted] = useState(shouldMount)
  let [willUnmount, setWillUnmount] = useState(false)

  useLayoutEffect(() => {
    if (shouldMount && !mounted) {
      setMounted(true)
      setWillUnmount(false)
    } else if (!shouldMount && mounted) {
      setWillUnmount(true)
      setTimeout(() => setMounted(false), delay)
    }
  }, [shouldMount])

  return {
    mounted,
    willUnmount
  }
}

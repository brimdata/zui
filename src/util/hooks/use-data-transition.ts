import {useEffect, useRef, useState} from "react"

export function useDataTransition<T>(
  real: T,
  inTransition: boolean,
  timeout = 500
) {
  const [timeExpired, setTimeExpired] = useState(false)
  const prev = useRef(real)

  useEffect(() => {
    if (!inTransition) prev.current = real
  }, [inTransition, real])

  useEffect(() => {
    let id: number
    if (inTransition) {
      id = setTimeout(() => setTimeExpired(true), timeout)
    } else {
      setTimeExpired(false)
    }
    return () => clearTimeout(id)
  }, [inTransition])

  if (inTransition && !timeExpired) {
    return prev.current
  } else {
    return real
  }
}

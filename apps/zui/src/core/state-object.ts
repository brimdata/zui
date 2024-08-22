import {useRef, useState} from "react"

export function useStateObject<T extends object>(init: T) {
  const initialState = useRef(init).current
  const [state, setState] = useState<T>(init)

  return {
    ...state,
    set: setState,
    setItem: <K extends keyof T>(key: K, value: T[K]) => {
      setState((prev) => ({...prev, [key]: value}))
    },
    merge: (newState: Partial<T>) => {
      setState({...state, ...newState})
    },
    reset: () => {
      setState({...initialState})
    },
  }
}

export type StateObject<T extends object> = T & {
  set: React.Dispatch<React.SetStateAction<T>>
  setItem: <K extends keyof T>(key: K, value: T[K]) => void
  merge: (newState: Partial<T>) => void
  reset: () => void
}

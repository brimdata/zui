import {useRef, useState} from "react"

export function useStateObject<T>(init: T) {
  const initialState = useRef(init).current
  const [state, setState] = useState<T>(init)

  return {
    ...state,
    set: setState,
    setItem: (key: string, value: any) => {
      setState((prev) => ({...prev, [key]: value}))
    },
    merge: (newState: Partial<T>) => {
      setState({...state, ...newState})
    },
    reset() {
      setState({...initialState})
    },
  }
}

export type StateObject<S> = S & ReturnType<typeof useStateObject>

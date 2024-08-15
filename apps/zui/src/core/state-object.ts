import {useState} from "react"

export function useStateObject<T>(init: T) {
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
  }
}

export type StateObject<S> = S & ReturnType<typeof useStateObject>

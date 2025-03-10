import {get} from "lodash"
import {useHistory} from "react-router"

export function useLocationState<T>(key: string, defaultValue: T) {
  const history = useHistory()
  const value = get(history.location.state, key, defaultValue)
  const setValue = (newValue) => {
    const prev = (history.location.state as object) || {}
    const next = {...prev, [key]: newValue}
    history.location.state = next
  }
  return [value, setValue]
}

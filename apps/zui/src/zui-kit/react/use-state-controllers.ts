import {useState} from "react"
import {getSliceController} from "../core/state/slice-controller"

/**
 * THREE MODES
 *
 * 1. Fully Controlled
 * If the user provides a state prop with a controller, it will be fully controlled.
 *
 * 2. Fully Uncontrolled
 * If the user does not provide a state prop or any [sliceName]State properties.
 *
 * 3. Partially Controlled
 * If the use spcifies some slice controllers.
 */

export function useStateControllers<State>(
  props: Record<string, any>,
  defaultState: () => State
) {
  // This is the internal controller
  // it will be used when the parent component does not provide
  // a "state" prop, or only provides some of the "[partial]State" props.
  // It will also be used as a place to keep the default values
  const [value, onChange] = useState<State>(defaultState)
  const fallbackController = {value, onChange}

  const [keys] = useState(() => Object.keys(defaultState()))
  const controllers = {}
  for (let key of keys) {
    controllers[key + "State"] = getSliceController(
      props,
      key,
      fallbackController
    )
  }
  // No each key in the state object has it's own controller
  // with a value and an onChange property.
  return controllers
}

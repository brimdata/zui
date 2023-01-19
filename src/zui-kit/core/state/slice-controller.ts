import {ControllerOpts} from "src/zui-kit/types/utils"

/**
 * A Partial Controller lets the parent component control some of the state
 *
 * If that pass a "state" prop with a value and onChange prop, then all state
 * changes will go through that. Any other partial controllers will not be used.
 * That is for a "fully controlled" component.
 *
 * Fully "uncontrolled" would be to pass nothing and allow the internal controller
 * to handle all state changes.
 *
 * Finally, the user can pass a few partial controllers to control pieces of the
 * state, leaving the rest to the internal controller.
 */

function createPartialController(opts: ControllerOpts<any>, defaultValue: any) {
  if (opts.defaultValue && opts.value) {
    throw new Error("You cannot have a defaultValue and a value")
  }
  if (opts.defaultValue && opts.onChange) {
    throw new Error(
      "Use the value option if you are providing an onChange handler"
    )
  }
  return {
    value: opts.defaultValue ?? opts.value ?? defaultValue,
    onChange: opts.onChange ?? (() => {}),
  }
}

export function getSliceController(props, name, internal) {
  const root = props.state
  if (root) {
    return {
      value: root.value[name] ?? internal.value[name],
      onChange: (next) => root.onChange({...root.value, [name]: next}),
    }
  }
  const partial = props[`${name}State`]
  if (partial) {
    return createPartialController(partial, internal.value[name])
  } else {
    return {
      value: internal.value[name],
      onChange: (next) =>
        internal.onChange((prev) => ({...prev, [name]: next})),
    }
  }
}

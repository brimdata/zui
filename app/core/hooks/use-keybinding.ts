import mousetrap from "mousetrap"
import {useEffect, useRef} from "react"

/**
 * Use key binding
 *
 * @param  {(string | string[])} handlerKey - A key, key combo or array of combos according to Mousetrap documentation.
 * @param  { function } handlerCallback - A function that is triggered on key combo catch.
 * @param  { string } evtType - A string that specifies the type of event to listen for. It can be 'keypress', 'keydown' or 'keyup'.
 */
export default (
  handlerKey: string | string[],
  handlerCallback: Function,
  evtType?: "keypress" | "keydown" | "keyup"
) => {
  const actionRef = useRef<Function | null>(null)
  actionRef.current = handlerCallback

  useEffect(() => {
    mousetrap.bind(
      handlerKey,
      (evt, combo) => {
        typeof actionRef.current === "function" && actionRef.current(evt, combo)
      },
      evtType
    )
    return () => {
      mousetrap.unbind(handlerKey)
    }
  }, [handlerKey])
}

import React from "react"
import useSelect from "src/app/core/hooks/use-select"
import {syncPool} from "src/app/core/pools/sync-pool"
import {useDispatch} from "src/app/core/state"
import Current from "src/js/state/Current"
import ToolbarButton from "src/app/toolbar/button"
import PopMenuPointy from "../PopMenu/PopMenuPointy"
import useSpanPickerMenu from "../useSpanPickerMenu"

type Props = {
  submit: Function
}

export default function SpanPicker({submit}: Props) {
  const menu = useSpanPickerMenu(submit)
  const dispatch = useDispatch()
  const select = useSelect()

  function onClick() {
    const poolId = select(Current.getPoolId)
    dispatch(syncPool(poolId))
  }

  return (
    <PopMenuPointy template={menu} position="bottom right">
      <div title="Choose a preset time span">
        <ToolbarButton className="time-span-menu" dropdown onClick={onClick} />
      </div>
    </PopMenuPointy>
  )
}

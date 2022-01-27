import React from "react"
import useSelect from "app/core/hooks/use-select"
import {syncPool} from "app/core/pools/sync-pool"
import {useDispatch} from "react-redux"
import Current from "src/js/state/Current"
import ToolbarButton from "../../../../app/toolbar/button"
import {reactElementProps} from "../../../../test/playwright/helpers/integration"
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
    <PopMenuPointy
      template={menu}
      position="bottom right"
      {...reactElementProps("span_menu")}
    >
      <div title="Choose a preset time span">
        <ToolbarButton
          className="time-span-menu"
          dropdown
          onClick={onClick}
          {...reactElementProps("span_button")}
        />
      </div>
    </PopMenuPointy>
  )
}

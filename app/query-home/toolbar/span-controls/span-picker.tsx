import {useDispatch} from "react-redux"
import React from "react"

import {reactElementProps} from "test/playwright/helpers/integration"
import PopMenuPointy from "src/js/components/PopMenu/PopMenuPointy"
import ToolbarButton from "app/toolbar/button"
import refreshPoolInfo from "src/js/flows/refreshPoolInfo"
import useSpanPickerMenu from "./hooks/use-span-picker-menu"

type Props = {
  submit: Function
}

const SpanPicker = ({submit}: Props) => {
  const menu = useSpanPickerMenu(submit)
  const dispatch = useDispatch()

  function onClick() {
    dispatch(refreshPoolInfo())
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

export default SpanPicker

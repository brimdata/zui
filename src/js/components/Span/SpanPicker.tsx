import {useDispatch} from "react-redux"
import React from "react"

import {reactElementProps} from "../../test/integration"
import PopMenuPointy from "../PopMenu/PopMenuPointy"
import ToolbarButton from "../Toolbar/Button"
import refreshSpaceInfo from "../../flows/refreshSpaceInfo"
import useSpanPickerMenu from "../useSpanPickerMenu"

export default function SpanPicker() {
  const menu = useSpanPickerMenu()
  const dispatch = useDispatch()

  function onClick() {
    dispatch(refreshSpaceInfo())
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

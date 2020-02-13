/* @flow */
import {useDispatch} from "react-redux"
import React from "react"

import {reactElementProps} from "../../test/integration"
import MenuBarButton from "../MenuBarButton"
import PopMenuPointy from "../PopMenu/PopMenuPointy"
import refreshSpaceInfo from "../../flows/refreshSpaceInfo"
import useSpanPickerMenu from "../useSpanPickerMenu"

export default function SpanPicker() {
  let dispatch = useDispatch()
  let menu = useSpanPickerMenu()
  return (
    <PopMenuPointy
      template={menu}
      position="bottom right"
      {...reactElementProps("span_menu")}
    >
      <MenuBarButton
        dropdown
        {...reactElementProps("span_button")}
        className="time-span-menu"
        onClick={() => dispatch(refreshSpaceInfo())}
      />
    </PopMenuPointy>
  )
}

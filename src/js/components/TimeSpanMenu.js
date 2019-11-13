/* @flow */
import React from "react"

import {reactElementProps} from "../test/integration"
import MenuBarButton from "./MenuBarButton"
import PopMenuPointy from "./PopMenu/PopMenuPointy"
import useSpanPickerMenu from "./useSpanPickerMenu"

export default function SpanPickerMenu() {
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
      />
    </PopMenuPointy>
  )
}

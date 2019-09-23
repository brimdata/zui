/* @flow */
import {useSelector} from "react-redux"
import React from "react"

import type {ModalBoxProps} from "./types"
import ModalContents from "./ModalContents"
import modal from "../../modal"
import useDelayedUnmount from "../../hooks/useDelayedUnmount"

let duration = 150

export default function ModalBox({name, children, ...props}: ModalBoxProps) {
  let active = useSelector(modal.getName)
  let {mounted, willUnmount} = useDelayedUnmount(name === active, duration)
  if (!mounted) return null
  return (
    <ModalContents {...props} willUnmount={willUnmount} duration={duration}>
      {children}
    </ModalContents>
  )
}

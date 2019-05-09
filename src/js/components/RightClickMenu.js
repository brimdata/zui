/* @flow */

import React from "react"
import ReactMeasure from "react-measure"

import type {RightClickAction} from "../rightclick/actions"
import {XRightClickMenuItem} from "./RightClickMenuItem"
import {ensureVisible} from "../lib/MenuStyler"
import MenuList from "./MenuList"
import Portal from "./Portal"

type Props = {
  actions: RightClickAction[],
  style: Object,
  onClose: Function
}

const RightClickMenu = (props: Props) => {
  return (
    <ReactMeasure bounds>
      {({measureRef, contentRect}) => {
        return (
          <Portal
            isOpen={true}
            onClose={props.onClose}
            style={ensureVisible(contentRect.bounds, props.style)}
          >
            <MenuList ref={measureRef}>
              {props.actions.map((action, index) => (
                <XRightClickMenuItem key={index} action={action} />
              ))}
            </MenuList>
          </Portal>
        )
      }}
    </ReactMeasure>
  )
}

export default RightClickMenu

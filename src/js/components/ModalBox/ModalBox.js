/* @flow */
import {useSelector} from "react-redux"
import React from "react"

import type {ModalBoxProps} from "./types"
import Animate from "../Animate"
import ModalContents from "./ModalContents"
import modal from "../../state/Modal"

export default function ModalBox({name, children, ...props}: ModalBoxProps) {
  let active = useSelector(modal.getName)

  function enter(anime, el) {
    return anime
      .timeline({
        duration: 150
      })
      .add({
        targets: document.querySelector(".modal-overlay"),
        backgroundColor: ["rgba(0,0,0,0.0)", "rgba(0,0,0,0.4)"],
        easing: "linear"
      })
      .add(
        {
          targets: el.querySelector(".modal-contents"),
          opacity: {
            value: [0, 1],
            easing: "easeInOutSine"
          },
          scale: [0.8, 1],
          easing: "easeInOutSine"
        },
        0
      )
  }

  return (
    <Animate show={active === name} enter={enter} exit="reverse">
      <ModalContents {...props}>{children}</ModalContents>
    </Animate>
  )
}

/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useLayoutEffect, useRef, useState} from "react"
import ReactDOM from "react-dom"
import anime from "animejs"
import classNames from "classnames"

import {InputSubmit} from "./form/Inputs"
import type {ModalName} from "../modal/types"
import {isString} from "../lib/is"
import ButtonRow from "./ButtonRow"
import CloseButton from "./CloseButton"
import * as Doc from "../lib/Doc"
import modal from "../modal"
import useListener from "../hooks/useListener"

type Button = {label: string, click: Function}
type Props = {
  children: *,
  title: string,
  name: ModalName,
  className?: string,
  buttons: string | Button[]
}

let d = 200

function useDelayedUnmount(show, delay) {
  let [mounted, setMounted] = useState(show)
  let [unmounting, setUnmounting] = useState(false)

  useEffect(() => {
    if (show && !mounted) {
      setMounted(true)
      setUnmounting(false)
    } else if (!show && mounted) {
      setUnmounting(true)
      setTimeout(() => setMounted(false), delay)
    }
  }, [show])

  return {
    mounted,
    unmounting
  }
}

export default function Modal({name, children, ...props}: Props) {
  let active = useSelector(modal.getName)

  let {mounted, unmounting} = useDelayedUnmount(name === active, d)

  if (!mounted) {
    return null
  } else {
    return (
      <ModalWrapper {...props} unmounting={unmounting}>
        {children}
      </ModalWrapper>
    )
  }
}

function ModalWrapper({children, ...props}) {
  let ref = useRef()

  useLayoutEffect(() => {
    if (!props.unmounting) {
      anime({
        targets: ref.current,
        backgroundColor: "rgba(0,0,0,0.4)",
        easing: "linear",
        duration: d
      })
    } else {
      anime({
        targets: ref.current,
        backgroundColor: "rgba(0,0,0,0.0)",
        easing: "linear",
        duration: d
      })
    }
  }, [props.unmounting])

  return ReactDOM.createPortal(
    <div className="modal-overlay" ref={ref}>
      <ModalContents {...props}>{children}</ModalContents>
    </div>,
    Doc.id("modal-root")
  )
}

function ModalContents({children, className, title, buttons, unmounting}) {
  let dispatch = useDispatch()

  useListener(document, "keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
      e.stopPropagation()
      e.preventDefault()
      close()
    }
  })

  const onClick = (button, e) => button.click(close, e)

  function getButtons(): Button[] {
    if (isString(buttons)) {
      return [{label: buttons, click: close}]
    } else if (!buttons) {
      return []
    } else {
      return buttons
    }
  }

  function close() {
    dispatch(modal.hide())
  }

  let ref = useRef()
  useLayoutEffect(() => {
    if (!unmounting) {
      anime({
        targets: ref.current,
        opacity: {
          value: [0.5, 1],
          easing: "easeInOutSine",
          duration: d
        },
        scale: [0.7, 1],
        duration: d,
        easing: "easeInOutSine"
      })
    } else {
      anime({
        targets: ref.current,
        opacity: {
          value: [1, 0],
          easing: "easeInOutSine",
          duration: d
        },
        scale: [1, 0.7],
        duration: d,
        easing: "easeInOutSine"
      })
    }
  }, [unmounting])

  return (
    <div className={classNames("modal-contents", className)} ref={ref}>
      <CloseButton light onClick={close} />
      <h2 className="modal-header">{title}</h2>
      <div className="modal-body">{children}</div>
      <ButtonRow>
        {getButtons().map((b) => (
          <InputSubmit
            key={b.label}
            value={b.label}
            type="button"
            onClick={(e) => onClick(b, e)}
          />
        ))}
      </ButtonRow>
    </div>
  )
}

// anime({

// })

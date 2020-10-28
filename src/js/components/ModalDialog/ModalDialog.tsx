import React, {useEffect, useState} from "react"
import ReactDOM from "react-dom"
import {CSSTransition} from "react-transition-group"
import styled from "styled-components"
import doc from "../../lib/doc"

const Overlay = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  padding-top: 42px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 2;
  overflow: hidden;
`

const Background = styled.div`
  --blur-color: rgba(228, 229, 231, 0.65);
  --blue-shadow: rgba(6, 15, 24, 0.42);

  pointer-events: all;
  display: flex;
  overflow: hidden;
  min-height: 100px;
  min-width: 300px;
  max-width: 80%;
  max-height: 80%;
  background: var(--blur-color);
  backdrop-filter: blur(13px);
  box-shadow: 0 2px 6px 2px var(--blue-shadow);
  border-radius: 0 0 2px 2px;
  opacity: 1;

  &.appear {
    transform: translateY(-100%);
  }

  &.appear-active {
    transition: all 300ms ease-out;
    transform: translateY(0%);
  }

  &.exit {
    transform: translateY(0);
  }

  &.exit-active {
    transition: transform 300ms;
    transform: translateY(-100%);
  }

  &.exit-done {
    display: none;
  }
`

export const Content = styled.div`
  ${(p) => p.theme.typography.labelNormal}
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding-top: 24px;
  & > * {
    padding-left: 12px;
    padding-right: 12px;
  }
`

export const Title = styled.h2`
  ${(p) => p.theme.typography.headingPage}
`

export const Scrollable = styled.div`
  overflow: auto;
`

export const Footer = styled.footer`
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: row-reverse;
  padding: 6px 12px;
`

export const Pre = styled.pre`
  font-size: 11px;
`

interface ChildProps {
  onClose: () => any
}

type Props = {
  children: (props: ChildProps) => any
  onClosed: () => any
}

export function ModalDialog(props: Props) {
  const [show, setShow] = useState(true)
  const onClose = () => setShow(false)

  useEffect(() => {
    if (show) {
      document.body.style.pointerEvents = "none"
    } else {
      document.body.style.pointerEvents = ""
    }
    return () => {
      document.body.style.pointerEvents = ""
    }
  }, [show])

  return ReactDOM.createPortal(
    <Overlay>
      <CSSTransition
        in={show}
        appear
        classNames=""
        timeout={310}
        onExited={() => setTimeout(props.onClosed, 100)}
      >
        <Background>{props.children({onClose})}</Background>
      </CSSTransition>
    </Overlay>,
    doc.id("modal-dialog-root")
  )
}

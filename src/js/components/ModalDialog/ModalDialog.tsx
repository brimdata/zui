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
  --blur-color: hsla(32, 5%, 85%, 0.5);
  --blur-shadow: hsla(32, 5%, 20%, 0.5);

  pointer-events: all;
  display: flex;
  overflow: hidden;
  min-height: 100px;
  min-width: 300px;
  max-width: 80%;
  max-height: 80%;
  background: var(--blur-color);
  backdrop-filter: blur(24px);
  box-shadow: 0 0 1px hsla(28, 5%, 20%, 0.75),
    0 12px 45px hsla(28, 5%, 20%, 0.6);
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
  padding-top: 18px;
  & > * {
    padding-left: 12px;
    padding-right: 12px;
  }
`

export const Title = styled.h2`
  ${(p) => p.theme.typography.headingPage}
  margin-bottom: 12px;
`

export const SmallTitle = styled.h2`
  ${(p) => p.theme.typography.headingList}
  margin-bottom: 24px;
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

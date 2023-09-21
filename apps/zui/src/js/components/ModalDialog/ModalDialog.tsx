import React, {useState} from "react"
import ReactDOM from "react-dom"
import {CSSTransition} from "react-transition-group"
import styled from "styled-components"
import doc from "../../lib/doc"
import useEscapeKey from "../hooks/useEscapeKey"
import {useFreezeBody} from "../hooks/useFreezeBody"
import {NewPoolModal} from "src/panes/new-pool-modal"

const Overlay = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding-top: 10vh;
  z-index: 200;
  overflow: hidden;
  background-color: hsla(212 10% 10% / 0.3);

  opacity: 0;

  &.appear-active {
    opacity: 1;
    transition: all 700ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  &.enter-done {
    opacity: 1;
  }

  &.exit {
    opacity: 1;
  }

  &.exit-active {
    opacity: 0;
    transition: all 700ms cubic-bezier(0.16, 1, 0.3, 1);
  }
`

const Background = styled.div`
  pointer-events: all;
  background: white;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
  box-shadow: 0 22px 80px hsla(0 0% 72% / 0.8);
  border-radius: 8px;
  border: 1px solid hsl(0 0% 85%);

  // start
  opacity: 0;
  transform: scale(0.8) translateY(-136px);

  &.appear-active {
    transform: scale(1) translateY(0px);
    opacity: 1;

    transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1),
      opacity 500ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  &.appear-done {
    opacity: 1;
    transform: translateY(0px);
  }

  &.exit {
    transform: scale(1);
    opacity: 1;
  }

  &.exit-active {
    transform: scale(0.5);
    opacity: 0;
    transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1),
      opacity 500ms cubic-bezier(0.16, 1, 0.3, 1);
  }
`

export const Content = styled.div<{width?: number}>`
  min-height: 0;
  min-width: 100%;
  width: ${(p) => (p.width && p.width + "px") || "100%"};
  display: flex;
  flex-direction: column;
  padding-top: 32px;
  gap: 28px;
  & > * {
    padding-left: 24px;
    padding-right: 24px;
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
  display: flex;
  flex-direction: row-reverse;
  padding: 12px 24px;
`

export const Pre = styled.pre`
  font-size: 11px;
  overflow-x: visible;
  overflow-y: visible;
  padding: 12px 24px;
`

export const ButtonGroup = styled.div`
  display: flex;
  & > * {
    margin-right: 12px;
    &:last-child {
      margin-right: 0px;
    }
  }
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

  useFreezeBody(show)
  useEscapeKey(onClose)

  return ReactDOM.createPortal(
    <CSSTransition
      // @ts-ignore
      addEndListener={(node, done) => {
        node.addEventListener("transitionend", done, false)
      }}
      in={show}
      classNames={""}
      appear
      onExited={() => setTimeout(props.onClosed, 100)}
    >
      <Overlay>
        <CSSTransition
          in={show}
          // @ts-ignore
          addEndListener={(node: HTMLElement, done: () => void) => {
            node.addEventListener("transitionend", done, false)
          }}
          appear
        >
          <Background role="dialog">
            <NewPoolModal onClose={onClose} />
          </Background>
        </CSSTransition>
      </Overlay>
    </CSSTransition>,
    doc.id("modal-root")
  )
}

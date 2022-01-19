import React, {useLayoutEffect, useRef} from "react"
import DropdownArrow from "src/js/icons/DropdownArrow"
import {cssVar, transparentize} from "polished"
import styled, {keyframes} from "styled-components"
import useOutsideClick from "src/js/components/hooks/useOutsideClick"
import Icon from "app/core/Icon"

export const StyledSection = styled.section`
  position: relative;
  min-height: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const SectionContents = styled.div`
  flex: 1;
  overflow-y: auto;
  position: relative;
  padding-top: 6px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 1px;
    box-shadow: inset 0 0.5px 0 0 var(--aqua);
    opacity: 0.12;
  }
`

export const StyledArrow = styled(DropdownArrow)`
  stroke: var(--aqua);
  opacity: 0.3;
  width: 8px;
  height: 8px;
  display: block;
  margin-left: 12px;
  transform: ${(props) => (props.show ? `rotate(0deg)` : "rotate(-90deg)")};
`

export const StyledItem = styled.a`
  ${(p) => p.theme.typography.labelNormal}
  line-height: 16px;
  -webkit-user-drag: none;
  color: var(--aqua);
  display: flex;
  align-items: center;
  text-decoration: none;
  flex: 1;
  width: 100%;
  cursor: default;
  border-radius: 6px;
  margin: 0 10px;
  padding: 6px 26px 6px 16px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`

const bgColor = transparentize(0.1, cssVar("--cello") as string)
const reveal = keyframes`
    from {
        clip-path: circle(30%);
    }
    to {
        clip-path: circle(100%);
    }
`

const DropBG = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0;
  background: ${bgColor};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  animation: fadein 0.5s, ${reveal} ease-in 0.5s;
  box-shadow: inset 0 0px 10px rgba(0, 0, 0, 0.5);
  ${(p) => p.theme.typography.headingSection}
`

export const ItemBG = styled.div`
  height: 24px;
  font-family: system-ui;
  font-weight: 400;
  font-size: 11px;
  line-height: 24px;
  color: var(--aqua);
  display: flex;
  align-items: center;
  overflow: hidden;
  cursor: default;
  user-select: none;
  outline: none;

  &.isOverFolder {
    background-color: hsla(0 0% 0% / 0.06);
  }

  &.isDragging:not(.isSelected) {
    background-color: inherit;
  }
`

export const Name = styled.p`
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
  flex: 1;
`

export const Input = styled.input`
  font-size: 11px;
  font-family: system-ui;
  font-weight: 400;
  line-height: 24px;
  color: var(--aqua);
  padding: 0 3px;
  border: 1px solid var(--havelock);
  height: 19px;
  outline: none;
  border-radius: 2px;
  margin: 0 2px 0 -4px;
  width: 100%;
  flex: 1;
`

const DropMessage = styled.p`
  animation: updown 1200ms ease-in-out infinite alternate;
`

export const DropOverlay = (props: {
  children: React.ReactNode
  show: boolean
}) => {
  if (props.show) {
    return (
      <DropBG>
        <DropMessage>{props.children}</DropMessage>
      </DropBG>
    )
  } else {
    return null
  }
}

export const Rename = ({item, onSubmit}) => {
  const input = useRef(null)
  useLayoutEffect(() => input.current && input.current.select(), [])
  useOutsideClick(input, () => onSubmit(input.current.value))
  const onKey = (e) => {
    if (e.key === "Enter") onSubmit(input.current.value)
    else if (e.key === "Escape") onSubmit(item.name)
  }

  return (
    <Input
      ref={input}
      onKeyDown={onKey}
      type="text"
      autoFocus
      defaultValue={item.name}
    />
  )
}

export const SectionToolbar = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 1px;
    box-shadow: inset 0 0.5px 0 0 var(--aqua);
    opacity: 0.12;
  }
`

const StyledButtonRow = styled.div`
  background: rgba(0, 0, 0, 0.08);
  margin-bottom: 12px;
  border-radius: 3px;
`
const StyledButton = styled.button<{isSelected: boolean}>`
  ${(p) => p.theme.typography.labelNormal}
  background: ${(p) => (p.isSelected ? "var(--havelock)" : "transparent")};
  color: ${(p) => (p.isSelected ? "white" : "rgba(0, 0, 0, 0.7)")};
  border: none;
  border-radius: 3px;
  min-width: 65px;
  min-height: 18px;
  padding: 2px 12px;

  &:hover {
  ${({isSelected}) =>
    isSelected
      ? `
  opacity: 0.85
  `
      : `
  background: rgba(0, 0, 0, 0.04);
  `}
  }
`

export const ButtonRow = ({buttons}) => {
  return (
    <StyledButtonRow>
      {buttons.map(({label, onClick, isSelected}, i) => (
        <StyledButton key={i} onClick={onClick} isSelected={isSelected}>
          {label}
        </StyledButton>
      ))}
    </StyledButtonRow>
  )
}

export const SectionSearch = (props) => {
  return (
    <SectionSearchWrapper>
      <Icon name="query" />
      <SearchInput {...props} />
    </SectionSearchWrapper>
  )
}

const SectionSearchWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 12px;
  border: none;
  background: rgba(0, 0, 0, 0.03);
  padding: 2px 12px;

  svg {
    width: 16px;
    height: 16px;
    fill: rgba(0, 0, 0, 0.2);
    margin-right: 8px;
  }
`

const SearchInput = styled.input`
  height: 22px;
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
`

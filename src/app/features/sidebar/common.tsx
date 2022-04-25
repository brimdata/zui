import React from "react"
import {cssVar, transparentize} from "polished"
import styled, {keyframes} from "styled-components"
import Icon from "src/app/core/icon-temp"

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
  border-radius: 5px;
`
const StyledButton = styled.button<{isSelected: boolean}>`
  ${(p) => p.theme.typography.labelNormal}
  background: ${(p) => (p.isSelected ? "var(--havelock)" : "transparent")};
  color: ${(p) => (p.isSelected ? "white" : "rgba(0, 0, 0, 0.7)")};
  border: none;
  border-radius: 5px;
  min-width: 60px;
  padding: 2px 12px;
  height: 22px;

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
  border-radius: 5px;
  border: none;
  background: var(--input-background);
  padding: 2px 12px;

  svg {
    width: 16px;
    height: 16px;
    fill: rgba(0, 0, 0, 0.2);
    margin-right: 8px;
    opacity: 0.2;
  }
`

const SearchInput = styled.input`
  height: 22px;
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  &:focus {
    outline: none;
  }
`

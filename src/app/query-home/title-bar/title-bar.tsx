import React from "react"
import Icon from "src/app/core/icon-temp"
import styled from "styled-components"

const BG = styled.header`
  flex-shrink: 0;
  height: 28px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

const Title = styled.h2`
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 auto;
`

const Actions = styled.div`
  display: flex;
  padding: 0 16px;
  gap: 10px;
  position: absolute;
  &:first-child {
    left: 0px;
  }
  &:last-child {
    right: 0px;
  }
`

const Button = styled.button`
  background: white;
  border: none;
  height: 22px;
  width: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;

  &:hover {
    background: var(--button-background);
  }
  &:active {
    background: var(--button-background-active);
  }
`

const Nav = styled.div`
  display: flex;
  gap: 2px;
`

const TitleButton = styled(Button)`
  height: auto;
  width: auto;
  gap: 4px;
  padding: 0 4px;
`

export function TitleBar() {
  return (
    <BG>
      <Actions>
        <Nav>
          <Button>
            <Icon name="left-arrow" size={18} />
          </Button>
          <Button>
            <Icon name="right-arrow" size={18} />
          </Button>
        </Nav>
        <Button>
          <Icon name="history" size={18} />
        </Button>
      </Actions>

      <TitleButton>
        <Title>Total Prices for Vendors</Title>
        <Icon name="chevron-down" size={16} />
      </TitleButton>

      <Actions>
        <Button>
          <Icon name="plus" size={18} />
        </Button>
      </Actions>
    </BG>
  )
}

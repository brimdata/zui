/* @flow */

import {darken} from "polished"
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import styled from "styled-components"

import type {SearchTarget} from "../../state/SearchBar/types"
import type {Styled} from "../../types/styled"
import {cssVar} from "../../lib/cssVar"
import Current from "../../state/Current"
import DropDownArrow from "../../icons/DropdownArrow"
import SearchBar from "../../state/SearchBar"
import usePopupMenu from "../hooks/usePopupMenu"

const bg = cssVar("--ivory")

const bgActive = darken(0.03, bg)

const Wrap: Styled<> = styled.button.attrs((props) => ({
  background: props.active ? bgActive : bg
}))`
  border: none;
  height: 28px;
  background: ${(props) => props.background};
  margin-right: 1px;
  box-shadow: 0 0 0 0.5px var(--lead), inset 0 0 0 0.5px white;
  border-radius: 14px 2px 2px 14px;
  padding: 0 12px 0 14px;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  svg {
    width: 8px;
    height: 8px;
    stroke: var(--slate);
  }

  &:active {
    background: ${bgActive};
  }
`
const Label = styled.label`
  ${(p) => p.theme.typography.headingList}
  color: var(--slate);
  font-size: 8px;
  line-height: 28px;
  margin-right: 8px;
`

export default function TargetSelect() {
  const dispatch = useDispatch()
  const target = useSelector(SearchBar.getTarget)
  const space = useSelector(Current.mustGetSpace)
  const setTarget = (t: SearchTarget) => {
    dispatch(SearchBar.setTarget(t))
  }
  const menu = usePopupMenu([
    {label: "Events", click: () => setTarget("events")},
    {label: "Index", click: () => setTarget("index")}
  ])

  if (!space.hasIndex()) return null
  return (
    <Wrap onClick={menu.onClick} active={menu.isOpen}>
      <Label>{target}</Label>
      <DropDownArrow />
    </Wrap>
  )
}

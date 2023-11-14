import classNames from "classnames"
import React from "react"
import {useDispatch} from "src/app/core/state"
import Layout from "src/js/state/Layout"
import styled from "styled-components"
import {useActiveQuery} from "./context"
import {DetatchButton} from "./detatch-button"
import {HeadingButton} from "./heading-button"
import {HeadingMenu} from "./heading-menu"
import {OrangeTag} from "./orange-tag"
import {NavActions} from "./nav-actions"
import {QueryActions} from "./query-actions"

const BG = styled.div`
  display: flex;
  min-width: 120px;
  justify-content: center;
  align-items: center;
  flex: 1;
  background: rgba(0, 0, 0, 0.05);
  height: 28px;
  border-radius: 14px;
  justify-content: space-between;
  padding: 0 8px;
`

const Title = styled.h2`
  font-size: 14px;
  font-weight: 700;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.modified {
    font-style: italic;
  }
`

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 16px;
  gap: 12px;
  background: white;
`

export function HeadingSaved() {
  return (
    <Wrap>
      <NavActions />
      <SavedQuery />
      <QueryActions />
    </Wrap>
  )
}

function SavedQuery() {
  const dispatch = useDispatch()
  const active = useActiveQuery()

  if (!active.isSaved()) return null

  function onClick() {
    dispatch(Layout.showTitleForm())
  }
  return (
    <BG>
      <DetatchButton />
      <HeadingButton onClick={onClick}>
        <Title className={classNames({modified: active.isModified()})}>
          {active.name()} {active.isModified() && "*"}
        </Title>
        {active.isOutdated() && <OrangeTag>Outdated</OrangeTag>}
      </HeadingButton>
      <HeadingMenu />
    </BG>
  )
}

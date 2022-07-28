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

const BG = styled.div`
  display: flex;
  min-width: 120px;
  justify-content: center;
  align-items: center;
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

export function HeadingSaved() {
  const dispatch = useDispatch()
  const active = useActiveQuery()

  function onClick() {
    dispatch(Layout.showTitleForm("create"))
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

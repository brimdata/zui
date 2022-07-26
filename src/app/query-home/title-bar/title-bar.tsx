import React from "react"
import styled from "styled-components"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"
import {NavActions} from "./nav-actions"
import {Heading} from "./heading"
import {ActiveQuery} from "./active-query"
import {useTabId} from "src/app/core/hooks/use-tab-id"
import {QueryActions} from "./query-actions"

const BG = styled.header`
  flex-shrink: 0;
  height: 31px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

export function TitleBar() {
  const tabId = useTabId()
  const query = useSelector(Current.getQuery)
  const session = useSelector(Current.getQueryById(tabId))
  const version = useSelector(Current.getVersion)
  const active = new ActiveQuery(session, query, version)

  return (
    <BG>
      <NavActions />
      <Heading active={active} />
      <QueryActions active={active} />
    </BG>
  )
}

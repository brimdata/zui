import {useQueryIdNameMap} from "./use-query-id-name-map"
import React, {useEffect, useState} from "react"
import {useSelector} from "react-redux"
import {animated} from "react-spring"
import Lakes from "src/js/state/Lakes"
import {PoolsState} from "src/js/state/Pools/types"
import Pools from "../../state/Pools"
import Tabs from "../../state/Tabs"
import {useResizeObserver} from "../hooks/useResizeObserver"
import AddTab from "./AddTab"
import SearchTab from "./SearchTab"
import useTabController from "./useTabController"
import useTabLayout from "./useTabLayout"
import {useLocation} from "react-router"
import styled from "styled-components"
import Appearance from "src/js/state/Appearance"
import {
  SidebarToggleButton,
  RightSidebarToggleButton,
} from "src/views/sidebar/sidebar-toggle-button"
import tab from "src/js/models/tab"
import useLakeId from "src/app/router/hooks/use-lake-id"
import {bounded} from "src/util/bounded"

const AnimatedSearchTab = animated(SearchTab)
const MAX_WIDTH = 200

const BG = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  grid-area: tabs;
  gap: 10px;
  -webkit-app-region: drag;
`

const Container = styled.div`
  display: flex;
  position: relative;
  height: 100%;
  width: 100%;
  flex-shrink: 0;
  align-items: center;
  z-index: 2;
  flex: 1;
  margin-right: 44px;
  margin-left: -1px;
`

const TrafficLightBG = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 128px;
  flex-shrink: 0;
  z-index: 1;
  padding-right: 10px;
`

export default function TabBar() {
  useLocation() // Rerender this when the location changes
  const ids = useSelector(Tabs.getIds)
  const pools: PoolsState = useSelector(Pools.raw)
  const lakes = useSelector(Lakes.raw)
  const lakeId = useLakeId()
  const queryIdNameMap = useQueryIdNameMap()
  const count = ids.length
  const {ref, rect} = useResizeObserver()
  const [width, setWidth] = useState(0)
  const layout = useTabLayout(ids, width)
  const calcWidth = () => setWidth(bounded(rect.width / count, [0, MAX_WIDTH]))
  const ctl = useTabController(count, calcWidth)
  useEffect(() => calcWidth(), [rect.width])
  const sidebarCollapsed = !useSelector(Appearance.sidebarIsOpen)
  const rightbarCollapse = !useSelector(Appearance.secondarySidebarIsOpen)
  const paddingInlineEnd = rightbarCollapse ? 20 : 10
  const paddingInlineStart = sidebarCollapsed ? 20 : 0
  return (
    <BG style={{paddingInlineStart, paddingInlineEnd}}>
      {sidebarCollapsed && global.env.isMac && (
        <TrafficLightBG>
          <SidebarToggleButton />
        </TrafficLightBG>
      )}
      {sidebarCollapsed && !global.env.isMac && <SidebarToggleButton />}
      <Container
        ref={ref}
        onMouseLeave={ctl.onMouseLeave}
        role="tablist"
        id="main-area-tabs"
      >
        {ids.map((id: string) => {
          const tabModel = tab(id, lakes, pools, queryIdNameMap, lakeId)
          return (
            <AnimatedSearchTab
              {...layout.dragBinding({
                id,
                onDown: () => {
                  ctl.onTabClick(id)
                },
                onChange: (indices) => ctl.onTabMove(indices),
              })}
              key={id}
              title={tabModel.title()}
              icon={tabModel.icon()}
              style={layout.getStyle(id)}
              removeTab={(e) => ctl.onRemoveClick(e, id)}
              active={id === ctl.activeId}
              preview={id === ctl.previewId}
              isNew={false}
            />
          )
        })}
        <AddTab onClick={ctl.onAddClick} left={width * count} />
      </Container>
      <RightSidebarToggleButton />
    </BG>
  )
}

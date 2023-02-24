import {useQueryIdNameMap} from "src/app/query-home/hooks/use-query-id-name-map"
import React, {useEffect, useState} from "react"
import {useSelector} from "react-redux"
import {animated} from "react-spring"
import Lakes from "src/js/state/Lakes"
import {PoolsState} from "src/js/state/Pools/types"
import lib from "../../lib"
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
import env from "src/app/core/env"
import SidebarToggleButton from "src/app/features/sidebar/sidebar-toggle-button"
import tab from "src/js/brim/tab"

const AnimatedSearchTab = animated(SearchTab)
const MAX_WIDTH = 200

const BG = styled.div`
  box-shadow: inset 0 -1px 0 var(--border-color);
  background: var(--tab-background);
  display: flex;
  height: 100%;
  grid-area: tabs;
  -webkit-app-region: drag;
`

const Container = styled.div`
  display: flex;
  position: relative;
  height: 100%;
  width: 100%;
  flex-shrink: 0;
  align-items: flex-end;
  z-index: 2;
  flex: 1;
  margin-right: 86px;
`

const TrafficLightBG = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 128px;
  flex-shrink: 0;
  box-shadow: inset -1px -1px var(--border-color);
  background: var(--tab-background);
  z-index: 100;
  padding-right: 10px;
`

export default function TabBar() {
  useLocation() // Rerender this when the location changes
  const ids = useSelector(Tabs.getIds)
  const pools: PoolsState = useSelector(Pools.raw)
  const lakes = useSelector(Lakes.raw)
  const queryIdNameMap = useQueryIdNameMap()
  const count = ids.length
  const {ref, rect} = useResizeObserver()
  const [width, setWidth] = useState(0)
  const layout = useTabLayout(ids, width)
  const calcWidth = () =>
    setWidth(lib.bounded(rect.width / count, [0, MAX_WIDTH]))
  const ctl = useTabController(count, calcWidth)
  useEffect(() => calcWidth(), [rect.width])
  const sidebarCollapsed = !useSelector(Appearance.sidebarIsOpen)
  return (
    <BG>
      {sidebarCollapsed && env.isMac && (
        <TrafficLightBG>
          <SidebarToggleButton />
        </TrafficLightBG>
      )}
      <Container ref={ref} onMouseLeave={ctl.onMouseLeave}>
        {ids.map((id: string) => {
          const tabModel = tab(id, lakes, pools, queryIdNameMap)
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
    </BG>
  )
}

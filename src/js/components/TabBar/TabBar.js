/* @flow */
import {animated} from "react-spring"
import {useSelector} from "react-redux"
import React, {useEffect, useState} from "react"
import classNames from "classnames"

import {tabIsFetching} from "../../state/tab/selectors"
import {useResizeObserver} from "../hooks/useResizeObserver"
import AddTab from "./AddTab"
import SearchTab from "./SearchTab"
import Tabs from "../../state/tabs"
import brim from "../../brim"
import lib from "../../lib"
import useTabController from "./useTabController"
import useTabLayout from "./useTabLayout"

const AnimatedSearchTab = animated(SearchTab)
const MAX_WIDTH = 240

export default function TabBar() {
  let tabs = useSelector(Tabs.getData)
  let count = tabs.length
  let {ref, rect} = useResizeObserver()
  let [width, setWidth] = useState(0)
  let layout = useTabLayout(tabs, width)
  const calcWidth = () =>
    setWidth(lib.bounded(rect.width / count, [0, MAX_WIDTH]))
  let ctl = useTabController(count, calcWidth)

  useEffect(() => calcWidth(), [rect.width])

  return (
    <div className="tab-bar">
      <div className="tabs-container" ref={ref} onMouseLeave={ctl.onMouseLeave}>
        {tabs.map((tab, i) => (
          <AnimatedSearchTab
            {...layout.drag({
              index: i,
              id: tab.id,
              onDown: () => ctl.onTabClick(tab.id),
              moveTo: (index) => ctl.onTabMove(tab.id, index)
            })}
            key={tab.id}
            loading={tabIsFetching(tab)}
            title={brim.tab(tab).title()}
            style={layout.getStyle(i)}
            removeTab={(e) => ctl.onRemoveClick(e, tab.id)}
            className={classNames({
              active: tab.id === ctl.activeId
            })}
          />
        ))}
        <AddTab onClick={ctl.onAddClick} left={width * count} />
      </div>
    </div>
  )
}

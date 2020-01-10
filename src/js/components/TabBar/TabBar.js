/* @flow */
import {useSelector} from "react-redux"
import React from "react"
import classNames from "classnames"

import {tabIsFetching} from "../../state/tab/selectors"
import AddTab from "./AddTab"
import Animate from "../Animate"
import SearchTab from "./SearchTab"
import Tabs from "../../state/tabs"
import brim from "../../brim"
import useTabController from "./useTabController"
import useTabLayout from "./useTabLayout"

export default function TabBar() {
  let tabs = useSelector(Tabs.getData)
  let count = tabs.length
  let layout = useTabLayout(count)
  let ctl = useTabController(count, layout.calcWidth)

  return (
    <div className="tab-bar">
      <div
        className="tabs-container"
        ref={layout.ref}
        onMouseLeave={ctl.onMouseLeave}
      >
        {tabs.map((tab, i) => (
          <Animate enter={{opacity: [0, 1]}} key={tab.id} show={true}>
            <SearchTab
              {...layout.drag({
                index: i,
                id: tab.id,
                onDown: () => ctl.onTabClick(tab.id),
                moveTo: (index) => ctl.onTabMove(tab.id, index)
              })}
              loading={tabIsFetching(tab)}
              title={brim.tab(tab).title()}
              style={layout.getStyle(i, tab.id)}
              removeTab={(e) => ctl.onRemoveClick(e, tab.id)}
              onClick={() => ctl.onTabClick(tab.id)}
              className={classNames({
                active: tab.id === ctl.activeId,
                dragging: tab.id === layout.dragId
              })}
            />
          </Animate>
        ))}
        <AddTab onClick={ctl.onAddClick} left={layout.width * count} />
      </div>
    </div>
  )
}

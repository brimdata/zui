import React, {useEffect, useState} from "react"
import {useSelector} from "react-redux"
import {animated} from "react-spring"
import Lakes from "src/js/state/Lakes"
import brim from "../../brim"
import lib from "../../lib"
import Pools from "../../state/Pools"
import Tabs from "../../state/Tabs"
import {useResizeObserver} from "../hooks/useResizeObserver"
import AddTab from "./AddTab"
import SearchTab from "./SearchTab"
import useTabController from "./useTabController"
import useTabLayout from "./useTabLayout"

const AnimatedSearchTab = animated(SearchTab)
const MAX_WIDTH = 240

export default function TabBar() {
  const ids = useSelector(Tabs.getIds)
  const pools = useSelector(Pools.raw)
  const workspaces = useSelector(Lakes.raw)
  const count = ids.length
  const {ref, rect} = useResizeObserver()
  const [width, setWidth] = useState(0)
  const layout = useTabLayout(ids, width)
  const calcWidth = () =>
    setWidth(lib.bounded(rect.width / count, [0, MAX_WIDTH]))
  const ctl = useTabController(count, calcWidth)
  useEffect(() => calcWidth(), [rect.width])

  return (
    <div className="tab-bar">
      <div className="tabs-container" ref={ref} onMouseLeave={ctl.onMouseLeave}>
        {ids.map((id) => (
          <AnimatedSearchTab
            {...layout.dragBinding({
              id,
              onDown: () => ctl.onTabClick(id),
              onChange: (indices) => ctl.onTabMove(indices)
            })}
            key={id}
            title={brim.tab(id, workspaces, pools).title()}
            style={layout.getStyle(id)}
            removeTab={(e) => ctl.onRemoveClick(e, id)}
            active={id === ctl.activeId}
            isNew={false}
          />
        ))}
        <AddTab onClick={ctl.onAddClick} left={width * count} />
      </div>
    </div>
  )
}

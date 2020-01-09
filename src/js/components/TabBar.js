/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useRef, useState} from "react"
import classNames from "classnames"
import onIdle from "on-idle"

import {tabIsFetching} from "../state/tab/selectors"
import {useResizeObserver} from "./hooks/useResizeObserver"
import Animate from "./Animate"
import SearchTab from "./SearchTab"
import Tabs from "../state/tabs"
import lib from "../lib"

const MAX_WIDTH = 240

export default function TabBar() {
  let {ref, rect} = useResizeObserver()
  let dispatch = useDispatch()
  let tabs = useSelector(Tabs.getData)
  let activeTab = useSelector(Tabs.getActive)
  let [width, setWidth] = useState(0)
  let count = tabs.length
  let removedByClick = useRef(false)
  let [active, setActive] = useState(activeTab)

  useEffect(() => {
    if (!removedByClick.current) calcWidths(count)
  }, [count])

  useEffect(() => {
    setActive(activeTab)
  }, [activeTab])

  // let [diff, setDiff] = useState(0)
  // let [slot, setSlot] = useState(active)
  // let [status, setStatus] = useState("INIT")

  function addTab() {
    dispatch(Tabs.new())
  }

  function removeTab(id, e) {
    e.stopPropagation()
    removedByClick.current = true
    dispatch(Tabs.remove(id))
  }

  function activateTab(id) {
    setActive(id)
    onIdle(() => dispatch(Tabs.activate(id)))
  }

  function mouseLeave() {
    if (removedByClick.current) {
      calcWidths(count)
      removedByClick.current = false
    }
  }

  function calcWidths(length) {
    setWidth(Math.min(rect.width / length, MAX_WIDTH))
  }

  useEffect(() => {
    calcWidths(count)
  }, [rect.width])

  // function dragEnd(from, to) {
  //   setDiff(0)
  //
  //   setTimeout(() => {
  //     setStatus("INIT")
  //     if (from !== to) {
  //       dispatch(Tabs.move(from, to))
  //       dispatch(Tabs.activate(to))
  //     }
  //   }, 200)
  // }

  // function onMouseDown(e, i) {
  //   dispatch(Tabs.activate(i))
  //   setSlot(i)
  //   tabDrag(e, i, width, count)
  //     .start(() => setStatus("DRAGGING"))
  //     .drag(setDiff)
  //     .hover(setSlot)
  //     .end(dragEnd)
  // }

  function left(i) {
    let normal = i * width
    // let shiftLeft = (i - 1) * width
    // let shiftRight = (i + 1) * width
    //
    // if (status === "DRAGGING") {
    //   if (i === active) return normal + diff
    //   if (slot > active && i <= slot && i > active) return shiftLeft
    //   if (slot < active && i >= slot && i < active) return shiftRight
    //   return normal
    // }
    //
    // if (status === "DRAG_ENDING") {
    //   if (i === active) return slot * width
    //   if (slot > active && i <= slot && i > active) return shiftLeft
    //   if (slot < active && i >= slot && i < active) return shiftRight
    //   return normal
    // }

    return normal
  }

  function getStyle(i) {
    return {
      width: width,
      transform: `translateX(${left(i)}px)`
    }
  }

  function getTitle(tab) {
    return lib
      .compact([tab.search.space || "No Space", tab.searchBar.previous])
      .join(": ")
  }

  return (
    <div className="tab-bar">
      <div className="tabs-container" ref={ref} onMouseLeave={mouseLeave}>
        {tabs.map((tab, i) => (
          <Animate enter={{opacity: [0, 1]}} key={tab.id} show={true}>
            <SearchTab
              loading={tabIsFetching(tab)}
              title={getTitle(tab)}
              style={getStyle(i)}
              removeTab={(e) => removeTab(tab.id, e)}
              onClick={() => activateTab(tab.id)}
              className={classNames({
                active: tab.id === active
                // dragging: status === "DRAGGING"
              })}
            />
          </Animate>
        ))}
        <a
          className="add-tab"
          onClick={addTab}
          style={{transform: `translateX(${left(tabs.length)}px)`}}
        >
          +
        </a>
      </div>
    </div>
  )
}

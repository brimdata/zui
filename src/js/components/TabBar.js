/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useRef, useState} from "react"
import classNames from "classnames"
import onIdle from "on-idle"

import {useResizeObserver} from "./hooks/useResizeObserver"
import Animate from "./Animate"
import SearchTab from "./SearchTab"
import lib from "../lib"
import newTab from "../flows/newTab"
import tabs from "../state/tabs"

const MAX_WIDTH = 240

export default function TabBar() {
  let {ref, rect} = useResizeObserver()
  let dispatch = useDispatch()
  let allTabs = useSelector(tabs.getData)
  let activeTab = useSelector(tabs.getActive)
  let [width, setWidth] = useState(0)
  let count = allTabs.length
  let dirty = useRef(false)
  let [active, setActive] = useState(activeTab)

  useEffect(() => {
    setActive(activeTab)
  }, [activeTab])

  // let [diff, setDiff] = useState(0)
  // let [slot, setSlot] = useState(active)
  // let [status, setStatus] = useState("INIT")

  function addTab() {
    dispatch(newTab())
    calcWidths(count + 1)
  }

  function removeTab(id, e) {
    e.stopPropagation()
    dispatch(tabs.remove(id))
    dirty.current = true
  }

  function activateTab(id) {
    setActive(id)
    onIdle(() => dispatch(tabs.activate(id)))
  }

  function mouseLeave() {
    if (dirty.current) {
      calcWidths(count)
      dirty.current = false
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
  //       dispatch(tabs.move(from, to))
  //       dispatch(tabs.activate(to))
  //     }
  //   }, 200)
  // }

  // function onMouseDown(e, i) {
  //   dispatch(tabs.activate(i))
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
        {allTabs.map((tab, i) => (
          <Animate enter={{opacity: [0, 1]}} key={tab.id} show={true}>
            <SearchTab
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
          style={{transform: `translateX(${left(allTabs.length)}px)`}}
        >
          +
        </a>
      </div>
    </div>
  )
}

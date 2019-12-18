/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useRef, useState} from "react"
import classNames from "classnames"

import {useResizeObserver} from "./hooks/useResizeObserver"
import CloseButton from "./CloseButton"
import RampLeft from "../icons/ramp-left.svg"
import RampRight from "../icons/ramp-right.svg"
import tabDrag from "./tabDrag"
import tabs from "../state/tabs"

const MAX_WIDTH = 240

export default function TabBar() {
  let {ref, rect} = useResizeObserver()
  let dispatch = useDispatch()
  let allTabs = useSelector(tabs.getData)
  let active = useSelector(tabs.getActive)
  let [width, setWidth] = useState(0)
  let count = allTabs.length
  let dirty = useRef(false)
  let [diff, setDiff] = useState(0)
  let [slot, setSlot] = useState(active)
  let [status, setStatus] = useState("INIT")

  function addTab() {
    dispatch(tabs.add())
    dispatch(tabs.activate(allTabs.length))
    calcWidths(count + 1)
  }

  function removeTab(index) {
    dispatch(tabs.remove(index))
    dirty.current = true
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

  function dragEnd(from, to) {
    setStatus("DRAG_ENDING")
    setDiff(0)

    setTimeout(() => {
      setStatus("INIT")
      if (from !== to) {
        dispatch(tabs.move(from, to))
        dispatch(tabs.activate(to))
      }
    }, 200)
  }

  function onMouseDown(e, i) {
    dispatch(tabs.activate(i))
    setSlot(i)
    tabDrag(e, i, width, count)
      .start(() => setStatus("DRAGGING"))
      .drag(setDiff)
      .hover(setSlot)
      .end(dragEnd)
  }

  function left(i) {
    let normal = i * width
    let shiftLeft = (i - 1) * width
    let shiftRight = (i + 1) * width

    if (status === "DRAGGING") {
      if (i === active) return normal + diff
      if (slot > active && i <= slot && i > active) return shiftLeft
      if (slot < active && i >= slot && i < active) return shiftRight
      return normal
    }

    if (status === "DRAG_ENDING") {
      if (i === active) return slot * width
      if (slot > active && i <= slot && i > active) return shiftLeft
      if (slot < active && i >= slot && i < active) return shiftRight
      return normal
    }

    return normal
  }

  function getStyle(i) {
    return {
      width: width,
      transform: `translateX(${left(i)}px)`
    }
  }

  return (
    <div className="tab-bar">
      <div className="tabs-container" ref={ref} onMouseLeave={mouseLeave}>
        {allTabs.map((tab, i) => (
          <Tab
            tab={tab}
            style={getStyle(i)}
            key={tab.id}
            index={i}
            removeTab={removeTab}
            active={i === active}
            dragging={i === active && status === "DRAGGING"}
            onMouseDown={(e) => onMouseDown(e, i)}
          />
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

function Tab({tab, index, active, dragging, removeTab, ...rest}) {
  return (
    <div {...rest} className={classNames("tab", {active, dragging})}>
      <p className="title">{tab.searchBar.previous || "New Tab"}</p>
      <CloseButton
        onClick={(e) => {
          e.stopPropagation()
          removeTab(index)
        }}
      />
      <RampRight />
      <RampLeft />
    </div>
  )
}

/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import classNames from "classnames"

import CloseButton from "./CloseButton"
import RampLeft from "../icons/ramp-left.svg"
import RampRight from "../icons/ramp-right.svg"
import tabs from "../state/tabs"

export default function TabBar() {
  let dispatch = useDispatch()
  let allTabs = useSelector(tabs.getData)
  let active = useSelector(tabs.getActive)

  function addTab() {
    dispatch(tabs.add())
    dispatch(tabs.activate(allTabs.length))
  }

  return (
    <div className="tab-bar">
      {allTabs.map((tab, i) => (
        <Tab
          key={i}
          index={i}
          onClick={() => dispatch(tabs.activate(i))}
          active={i === active}
        />
      ))}
      <a className="add-tab" onClick={addTab}>
        +
      </a>
    </div>
  )
}

function Tab({index, active, onClick}) {
  let dispatch = useDispatch()
  return (
    <div onClick={onClick} className={classNames("tab", {active})}>
      <p className="title">Tab #{index}</p>
      <CloseButton
        onClick={(e) => {
          e.stopPropagation()
          dispatch(tabs.remove(index))
        }}
      />
      <RampRight />
      <RampLeft />
    </div>
  )
}

/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import classNames from "classnames"

import tabs from "../state/tabs"

export default function TabBar() {
  let dispatch = useDispatch()
  let allTabs = useSelector(tabs.getAll)
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
          active={i === parseInt(active)}
        />
      ))}
      <a onClick={addTab}>New Tab...</a>
    </div>
  )
}

function Tab({index, active, onClick}) {
  let dispatch = useDispatch()
  return (
    <div onClick={onClick} className={classNames("tab", {active})}>
      Tab #{index}
      <a onClick={() => dispatch(tabs.remove(index))}>X</a>
    </div>
  )
}

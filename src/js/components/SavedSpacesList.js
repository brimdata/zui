/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"

import Search from "../state/Search"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"

export default function SavedSpacesList() {
  let dispatch = useDispatch()
  let clusterId = useSelector(Tab.clusterId)
  let spaces = useSelector(Spaces.names(clusterId))

  useEffect(() => {
    dispatch(Spaces.refreshNames())
  }, [])

  function onClick(space) {
    dispatch(Search.setSpace(space))
  }

  return (
    <div className="saved-spaces-list">
      {spaces.map((s) => (
        <a onClick={() => onClick(s)} key={s} href="#">
          <span className="name">{s}</span>
          <div className="line" />
        </a>
      ))}
    </div>
  )
}

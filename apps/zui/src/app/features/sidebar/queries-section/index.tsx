import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import Appearance from "src/js/state/Appearance"
import {Content} from "../content"
import {SearchBar} from "../search-bar"
import {Toolbar} from "../toolbar"
import {QueriesTree} from "./queries-tree"
import {ToolbarTabs} from "src/components/toolbar-tabs"

export function QueriesSection() {
  const dispatch = useDispatch()
  const view = useSelector(Appearance.getQueriesView)

  const [searchTerm, setSearchTerm] = useState("")
  return (
    <>
      <Content>
        <QueriesTree source={view} searchTerm={searchTerm} />
      </Content>
      <Toolbar>
        <ToolbarTabs
          options={[
            {
              label: "Local",
              click: () => dispatch(Appearance.setQueriesView("local")),
              checked: "local" === view,
            },
            {
              label: "Remote",
              click: () => dispatch(Appearance.setQueriesView("remote")),
              checked: "remote" === view,
            },
          ]}
        />
        <SearchBar
          placeholder="Search queries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
        />
      </Toolbar>
    </>
  )
}

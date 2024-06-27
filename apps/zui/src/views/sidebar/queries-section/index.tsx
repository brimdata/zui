import React, {useState} from "react"
import {Content} from "../content"
import {SearchBar} from "../search-bar"
import {Toolbar} from "../toolbar"
import {QueriesTree} from "./queries-tree"

export function QueriesSection() {
  const [searchTerm, setSearchTerm] = useState("")
  return (
    <>
      <Content>
        <QueriesTree searchTerm={searchTerm} />
      </Content>
      <Toolbar>
        <SearchBar
          placeholder="Search queries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
        />
      </Toolbar>
    </>
  )
}

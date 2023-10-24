import React, {useState} from "react"
import {Contents} from "./contents"
import {Content} from "../content"
import {SearchBar} from "../search-bar"
import {Toolbar} from "../toolbar"

const PoolsSection = () => {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <>
      <Content>
        <Contents searchTerm={searchTerm} />
      </Content>
      <Toolbar>
        <SearchBar
          placeholder="Search pools..."
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
        />
      </Toolbar>
    </>
  )
}

export default PoolsSection

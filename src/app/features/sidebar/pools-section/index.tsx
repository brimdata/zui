import {useImportOnDrop} from "src/app/features/import/use-import-on-drop"
import React, {useState} from "react"
import {Contents} from "./contents"
import {Content} from "../content"
import {DropOverlay} from "../drop-overlay"
import {SearchBar} from "../search-bar"
import {Toolbar} from "../toolbar"

const PoolsSection = () => {
  const [{isOver}, drop] = useImportOnDrop()
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <>
      <Content ref={drop}>
        <Contents searchTerm={searchTerm} />
        <DropOverlay show={isOver}>Drop to import...</DropOverlay>
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

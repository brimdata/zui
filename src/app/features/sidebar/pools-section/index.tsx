import React, {useState} from "react"
import {Contents} from "./contents"
import {Content} from "../content"
import {DropOverlay} from "../drop-overlay"
import {SearchBar} from "../search-bar"
import {Toolbar} from "../toolbar"
import {useFilesDrop} from "src/util/hooks/use-files-drop"
import {createAndLoadFiles} from "src/app/commands/pools"

const PoolsSection = () => {
  const [{isOver}, drop] = useFilesDrop({
    onDrop: (files) => createAndLoadFiles.run(files),
  })
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

import React, {useState} from "react"
import {Contents} from "./contents"
import {Content} from "../content"
import {DropOverlay} from "../drop-overlay"
import {SearchBar} from "../search-bar"
import {Toolbar} from "../toolbar"
import {useFilesDrop} from "src/util/hooks/use-files-drop"
import {createAndLoadFiles} from "src/app/commands/pools"
import {useDispatch} from "src/app/core/state"
import Tabs from "src/js/state/Tabs"
import {lakePoolPath} from "src/app/router/utils/paths"

const PoolsSection = () => {
  const dispatch = useDispatch()
  const [{isOver}, drop] = useFilesDrop({
    onDrop: async (files) => {
      try {
        const poolId = await createAndLoadFiles.run(files.map((f) => f.path))
        dispatch(Tabs.activateUrl(lakePoolPath(poolId)))
      } catch (e) {
        // Handled
      }
    },
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

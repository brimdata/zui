import {useImportOnDrop} from "src/app/features/import/use-import-on-drop"
import React, {useState} from "react"
import {
  SectionContents,
  StyledSection,
  DropOverlay,
  SectionSearch,
} from "../common"
import {Contents} from "./contents"

const PoolsSection = () => {
  const [{isOver}, drop] = useImportOnDrop()
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <StyledSection>
      <SectionContents ref={drop}>
        <Contents searchTerm={searchTerm} />
        <DropOverlay show={isOver}>Drop to import...</DropOverlay>
      </SectionContents>
      <SectionSearch
        placeholder="Search pools..."
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
      />
    </StyledSection>
  )
}

export default PoolsSection

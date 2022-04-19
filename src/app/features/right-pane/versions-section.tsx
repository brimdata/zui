import React from "react"
import VersionItem from "./version-item"
import {useSectionTreeDefaults} from "../sidebar/hooks"
import {Tree} from "react-arborist"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"
import styled from "styled-components"

const SectionWrapper = styled.div`
  flex: 1;
  margin-top: 8px;
`

const VersionsSection = () => {
  const {resizeRef, defaults} = useSectionTreeDefaults()
  const query = useSelector(Current.getQuery)

  return (
    <SectionWrapper ref={resizeRef}>
      <Tree
        {...defaults}
        data={{
          id: "root",
          items: query
            .allVersions()
            .map((v) => ({...v, id: v.version}))
            .sort((a, b) => (a.ts < b.ts ? 1 : -1)),
        }}
      >
        {VersionItem}
      </Tree>
    </SectionWrapper>
  )
}

export default VersionsSection

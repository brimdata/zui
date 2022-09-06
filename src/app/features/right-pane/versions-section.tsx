import React from "react"
import VersionItem from "./version-item"
import {useSectionTreeDefaults} from "../sidebar/hooks"
import {Tree} from "react-arborist"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"
import styled from "styled-components"
import {BrimQuery} from "src/app/query-home/utils/brim-query"
import {EmptyText} from "./common"

const SectionWrapper = styled.div`
  flex: 1;
  margin-top: 8px;
`

const EmptyMessage = () => {
  return <EmptyText>Open a saved query to see the previous versions.</EmptyText>
}

const VersionsSection = () => {
  const active = useSelector(Current.getActiveQuery)
  if (active.isAnonymous()) {
    return <EmptyMessage />
  } else {
    return <VersionsList query={active.query} />
  }
}

const VersionsList = ({query}: {query: BrimQuery}) => {
  const {resizeRef, defaults} = useSectionTreeDefaults()
  return (
    <SectionWrapper ref={resizeRef}>
      <Tree
        {...defaults}
        data={{
          id: "root",
          items: query.versions
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

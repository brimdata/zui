import React from "react"
import VersionItem from "./version-item"
import {useSectionTreeDefaults} from "../sidebar/hooks"
import {Tree} from "react-arborist"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"
import styled from "styled-components"
import {BrimQuery} from "src/app/query-home/utils/brim-query"

const SectionWrapper = styled.div`
  flex: 1;
  margin-top: 8px;
`

const Text = styled.p`
  padding: 24px;
  margin-top: 33%;
  opacity: 0.5;
  text-align: center;
`

const EmptyMessage = () => {
  return <Text>Open a saved query to see the previous versions.</Text>
}

const VersionsSection = () => {
  const query = useSelector(Current.getQuery)
  const tabId = useSelector(Current.getTabId)
  if (!query || tabId === query.id) {
    return <EmptyMessage />
  } else {
    return <VersionsList query={query} />
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

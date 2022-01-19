import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useState} from "react"
import FilterTree from "./filter-tree"
import {
  ButtonRow,
  SectionContents,
  SectionToolbar,
  SectionSearch,
  StyledSection
} from "../common"
import {useSearchHistory, useSectionTreeDefaults} from "../hooks"
import Appearance from "src/js/state/Appearance"
import {HistoryView} from "src/js/state/Appearance/types"
import {capitalize} from "lodash"
import {Finding} from "src/js/state/Investigation/types"
import EmptySection from "src/js/components/common/EmptySection"
import BookIcon from "src/js/icons/BookSvgIcon"
import styled from "styled-components"
import {Tree} from "react-arborist"
import LinearHistoryItem from "./linear-history-item"

const StyledEmptySection = styled(EmptySection).attrs({icon: <BookIcon />})``

const historySearch = (term: string, items: Finding[]): Finding[] => {
  return items.filter(({search: {program, pins}}) =>
    JSON.stringify({program, pins})
      .toLowerCase()
      .includes(term.toLowerCase())
  )
}

const HistorySection = () => {
  const dispatch = useDispatch()
  const historyView = useSelector(Appearance.getHistoryView)
  const entries = useSearchHistory()
  const [filteredEntries, setFilteredEntries] = useState(entries)
  const {resizeRef, defaults} = useSectionTreeDefaults()

  useEffect(() => {
    setFilteredEntries(entries)
  }, [entries])

  const buttons = ["linear", "tree"].map((view: HistoryView) => ({
    label: capitalize(view),
    onClick: () => {
      setFilteredEntries(entries)
      dispatch(Appearance.setHistoryView(view))
    },
    isSelected: view === historyView
  }))

  const onHistorySearch = (e) => {
    setFilteredEntries(historySearch(e.target?.value, entries))
  }

  const renderContents = () => {
    if (historyView === "tree") return <FilterTree />
    if (!entries?.length)
      return (
        <StyledEmptySection message="As you search through your data, your history will appear here." />
      )
    if (!filteredEntries?.length)
      return (
        <StyledEmptySection message="No history entries match the search term." />
      )
    return (
      <Tree {...defaults} data={{id: "root", items: filteredEntries}}>
        {LinearHistoryItem}
      </Tree>
    )
  }

  return (
    <StyledSection>
      <SectionContents ref={resizeRef}>{renderContents()}</SectionContents>
      <SectionToolbar>
        <ButtonRow buttons={buttons} />
        {historyView === "linear" && (
          <SectionSearch
            placeholder="Search history..."
            onChange={onHistorySearch}
          />
        )}
      </SectionToolbar>
    </StyledSection>
  )
}

export default HistorySection

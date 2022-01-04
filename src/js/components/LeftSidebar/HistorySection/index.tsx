import {useDispatch, useSelector} from "react-redux"
import React, {useState} from "react"
import FilterTree from "./FilterTree"
import {
  ButtonRow,
  SectionContents,
  SectionToolbar,
  SectionSearch,
  StyledSection
} from "../common"
import HistoryLinear from "./HistoryLinnear"
import {useSearchHistory} from "../hooks"
import Appearance from "src/js/state/Appearance"
import {HistoryView} from "src/js/state/Appearance/types"
import {capitalize} from "lodash"
import {Finding} from "../../../state/Investigation/types"
import EmptySection from "../../common/EmptySection"
import BookIcon from "../../../icons/BookSvgIcon"
import styled from "styled-components"

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
    if (historyView === "tree")
      return (
        <SectionContents>
          <FilterTree />
        </SectionContents>
      )
    if (!entries?.length)
      return (
        <StyledEmptySection message="As you search through your data, your history will appear here." />
      )
    if (!filteredEntries?.length)
      return (
        <StyledEmptySection message="No history entries match the search term." />
      )
    return <HistoryLinear entries={filteredEntries} />
  }

  return (
    <StyledSection>
      {renderContents()}
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

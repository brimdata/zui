import React from "react"
import {useDispatch, useSelector} from "react-redux"
import BookIcon from "src/js/icons/BookSvgIcon"
import Current from "src/js/state/Current"
import EmptySection from "src/js/components/common/EmptySection"
import {ItemBG, SectionContents, StyledItem, Name} from "../common"
import classNames from "classnames"
import styled from "styled-components"
import Icon from "app/core/Icon"
import {isEmpty} from "lodash"
import {SearchRecord} from "src/js/types"
import Search from "src/js/state/Search"
import {submitSearch} from "src/js/flows/submitSearch/mod"
import Investigation from "src/js/state/Investigation"
import * as remote from "@electron/remote"
import {showContextMenu} from "src/js/lib/System"
import {MenuItemConstructorOptions} from "electron"
import {useSectionTreeDefaults} from "../hooks"
import {Tree} from "react-arborist"

const HistoryIcon = styled(Icon).attrs({name: "query"})``
const StyledHistoryItem = styled(StyledItem)`
  text-overflow: ellipsis;
  ${HistoryIcon} > svg {
    margin-right: 8px;
    width: 14px;
    height: 14px;
    fill: var(--slate)};
  }
`

type Props = {search: SearchRecord}

const Pin = styled.span`
  color: white;
  background: var(--green);
  border-radius: 3px;
  flex-shrink: 0;
  margin-right: 6px;
  padding: 2px 6px;
`

const StyledName = styled(Name)`
  overflow: inherit;
  overflow-x: ${"clip"};
`

const HistoryEntry = ({search}: Props) => {
  if (isEmpty(search.pins) && isEmpty(search.program)) return <p>*</p>

  return (
    <StyledName>
      {search.pins.map((text, i) => (
        <Pin key={i}>{text}</Pin>
      ))}
      <span>{search.program}</span>
    </StyledName>
  )
}

const HistoryItem = ({innerRef, styles, data: historyItem, state}) => {
  const dispatch = useDispatch()
  const workspaceId = useSelector(Current.getWorkspaceId)
  const poolId = useSelector(Current.getPoolId)

  function onClick() {
    dispatch(Search.restore(historyItem.search))
    dispatch(submitSearch({history: true, investigation: false}))
  }

  const ctxMenu: MenuItemConstructorOptions[] = [
    {
      label: "Delete",
      click: () =>
        dispatch(
          Investigation.deleteFindingByTs(workspaceId, poolId, historyItem.ts)
        )
    },
    {type: "separator"},
    {
      label: "Delete All",
      click: () =>
        remote.dialog
          .showMessageBox({
            type: "warning",
            title: "Delete All History",
            message: `Are you sure you want to delete all history entries for this pool?`,
            buttons: ["OK", "Cancel"]
          })
          .then(({response}) => {
            if (response === 0)
              dispatch(
                Investigation.clearPoolInvestigation(workspaceId, poolId)
              )
          })
    }
  ]

  return (
    <ItemBG
      tabIndex={0}
      ref={innerRef}
      style={styles.row}
      className={classNames(state)}
      onClick={onClick}
      onContextMenu={() => showContextMenu(ctxMenu)}
    >
      <StyledHistoryItem>
        <HistoryIcon />
        <HistoryEntry search={historyItem.search} />
      </StyledHistoryItem>
    </ItemBG>
  )
}

const HistoryLinear = ({entries}) => {
  const {resizeRef, defaults} = useSectionTreeDefaults()
  if (entries.length === 0)
    return (
      <EmptySection
        icon={<BookIcon />}
        message="As you search through your data, your history will appear here."
      />
    )

  return (
    <SectionContents ref={resizeRef}>
      <Tree {...defaults} data={{id: "root", items: entries}}>
        {HistoryItem}
      </Tree>
    </SectionContents>
  )
}

export default HistoryLinear

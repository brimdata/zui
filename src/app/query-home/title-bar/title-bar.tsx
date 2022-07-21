import React, {useEffect, useLayoutEffect, useRef, useState} from "react"
import Icon from "src/app/core/icon-temp"
import styled from "styled-components"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"
import AutosizeInput from "react-input-autosize"
import {useDispatch} from "../../core/state"
import tabHistory from "../../router/tab-history"
import {getQuerySource} from "../../../js/state/Queries/flows/get-query-source"
import useEnterKey from "../../../js/components/hooks/useEnterKey"
import useEscapeKey from "../../../js/components/hooks/useEscapeKey"
import {cssVar} from "../../../js/lib/cssVar"
import {updateQuery} from "../../../js/state/Queries/flows/update-query"
import Queries from "src/js/state/Queries"
import {lakeQueryPath} from "../../router/utils/paths"
import SessionHistories from "src/js/state/SessionHistories"
import BrimTooltip from "src/js/components/BrimTooltip"
import {showContextMenu} from "../../../js/lib/System"
import getQueryHeaderMenu from "../toolbar/flows/get-query-header-menu"
import getQueryListMenu from "../toolbar/flows/get-query-list-menu"
import Layout from "../../../js/state/Layout"
import QueryVersions from "../../../js/state/QueryVersions"
import {getTabId} from "../../../js/state/Current/selectors"
import {cloneDeep} from "lodash"
import {nanoid} from "@reduxjs/toolkit"

const BG = styled.header`
  flex-shrink: 0;
  height: 28px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

const Title = styled.h2`
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 auto;
`

const Actions = styled.div`
  display: flex;
  padding: 0 16px;
  gap: 10px;
  position: absolute;
  &:first-child {
    left: 0px;
  }
  &:last-child {
    right: 0px;
  }
`

const Button = styled.button`
  background: white;
  border: none;
  height: 22px;
  width: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;

  &:hover {
    background: var(--button-background);
  }
  &:active {
    background: var(--button-background-active);
  }
`

const Nav = styled.div`
  display: flex;
  gap: 2px;
`

const TitleButton = styled(Button)`
  height: auto;
  width: auto;
  gap: 4px;
  padding: 0 4px;
`

const StyledTitleWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
`

const StyledAnchor = styled.a<{isPrimary?: boolean; isIndented?: boolean}>`
  ${(props) => props.theme.typography.labelNormal}
  text-decoration: underline;
  color: ${(p) => (p.isPrimary ? "var(--havelock)" : "var(--slate)")};
  margin-left: ${(p) => (p.isIndented ? "10px" : "0")};
`

const TitleInput = ({onCancel, onSubmit}) => {
  const inputRef = useRef(null)
  const query = useSelector(Current.getQuery)
  const [queryTitle, setQueryTitle] = useState(query?.name)

  const handleEdit = () => {
    if (!queryTitle) onCancel()
    else onSubmit(queryTitle)
  }

  useEnterKey(() => {
    handleEdit()
  })
  useEscapeKey(() => {
    onCancel()
  })
  useEffect(() => {
    setQueryTitle(query?.name)
  }, [query])
  useLayoutEffect(() => {
    inputRef.current && inputRef.current.select()
  }, [])

  return (
    <StyledTitleWrapper>
      <AutosizeInput
        ref={inputRef}
        onChange={(e) => setQueryTitle(e.target.value)}
        value={queryTitle || ""}
        style={{
          overflow: "hidden",
          background: cssVar("--input-background"),
          borderRadius: "3px",
          padding: "2px 6px",
          margin: "-2px 0 1px -6px",
        }}
        inputStyle={{
          background: "transparent",
          margin: 0,
          padding: 0,
          fontWeight: 700,
          fontSize: "14px",
          letterSpacing: 0,
          lineHeight: "24px",
          display: "block",
          outline: "none",
          border: "none",
        }}
      />
      <StyledAnchor isPrimary isIndented onClick={handleEdit}>
        Save
      </StyledAnchor>
      <StyledAnchor isIndented onClick={onCancel}>
        Cancel
      </StyledAnchor>
    </StyledTitleWrapper>
  )
}

export function TitleBar() {
  const dispatch = useDispatch()
  const query = useSelector(Current.getQuery)
  const currentVersion = useSelector(Current.getVersion)
  const lakeId = useSelector(Current.getLakeId)
  const queryType = dispatch(getQuerySource(query.id))
  const tabId = useSelector(getTabId)
  const [isEditing, setIsEditing] = useState(false)
  const isSession = queryType === "session"
  const isModified =
    !isSession &&
    currentVersion.version !== query.latestVersionId() &&
    !query.hasVersion(currentVersion.version)
  const isOutdated =
    !isModified &&
    currentVersion.version !== query.latestVersionId() &&
    query.hasVersion(currentVersion.version)

  useEffect(() => setIsEditing(false), [query?.id])

  const getTitle = () => {
    if (isSession) return "Select Query"
    if (isModified) return <em>{query.name}*</em>
    if (isOutdated) return `${query.name} (outdated)`
    return query.name
  }

  const onSubmit = (newTitle) => {
    setIsEditing(false)
    if (newTitle !== "") {
      if (isSession) {
        const q = dispatch(
          Queries.create({...query.latestVersion(), name: newTitle})
        )
        dispatch(
          tabHistory.push(lakeQueryPath(q.id, lakeId, q.latestVersionId()))
        )
        dispatch(SessionHistories.push(q.id))
      } else {
        const newQuery = {...query.serialize(), name: newTitle}
        dispatch(updateQuery(query, newQuery))
      }
    }
  }

  const openOpsMenu = () => {
    if (isEditing || queryType === "session") return
    showContextMenu(
      dispatch(getQueryHeaderMenu({handleRename: () => setIsEditing(true)}))
    )
  }
  const openQueriesList = () => {
    if (isEditing) return
    showContextMenu(dispatch(getQueryListMenu()))
  }

  const doUpdate = (id, isPush = true) => {
    const versionCopy = {...cloneDeep(currentVersion), version: nanoid()}
    dispatch(
      QueryVersions.add({
        queryId: id,
        version: versionCopy,
      })
    )

    if (isPush) {
      dispatch(SessionHistories.push(id, versionCopy.version))
      dispatch(tabHistory.push(lakeQueryPath(id, lakeId, versionCopy.version)))
    } else {
      dispatch(SessionHistories.replace(id, versionCopy.version))
      dispatch(
        tabHistory.replace(lakeQueryPath(id, lakeId, versionCopy.version))
      )
    }
  }

  const handleUpdate = () => doUpdate(query.id, false)
  const handleDetach = () => doUpdate(tabId)

  return (
    <BG>
      <Actions>
        <Nav>
          <Button onClick={() => dispatch(tabHistory.goBack())}>
            <Icon name="left-arrow" size={18} />
          </Button>
          <Button onClick={() => dispatch(tabHistory.goForward())}>
            <Icon name="right-arrow" size={18} />
          </Button>
        </Nav>
        <Button onClick={() => dispatch(Layout.setCurrentPaneName("history"))}>
          <Icon name="history" size={18} />
        </Button>
      </Actions>

      <TitleButton onContextMenu={openOpsMenu} onClick={openQueriesList}>
        {isEditing ? (
          <TitleInput
            onSubmit={onSubmit}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <Title
              data-tip="query-title"
              data-for="query-title"
              data-place="bottom"
              data-effect="solid"
              data-delay-show={1000}
            >
              {getTitle()}
            </Title>
            {!isSession && (
              <BrimTooltip id="query-title" className="brim-tooltip-show-hover">
                {query?.name}
              </BrimTooltip>
            )}
          </>
        )}
        <Icon name="chevron-down" size={16} />
      </TitleButton>

      <Actions>
        {isSession ? (
          <Button onClick={() => !query.isReadOnly && setIsEditing(true)}>
            <Icon name="plus" size={18} />
          </Button>
        ) : (
          <>
            {/*TODO: Session Flow - use better icons*/}
            <Button onClick={handleDetach}>💔</Button>
            <Button onClick={handleUpdate}>
              {query.isReadOnly ? "🔒" : "💾"}
            </Button>
          </>
        )}
      </Actions>
    </BG>
  )
}

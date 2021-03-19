import Icon from "app/core/Icon"
import useLakeId from "app/router/hooks/use-lake-id"
import useWorkspaceId from "app/router/hooks/use-workspace-id"
import {lakeSearch, lakeSummary} from "app/router/routes"
import {lakeSearchPath, lakeSummaryPath} from "app/router/utils/paths"
import {capitalize} from "lodash"
import React from "react"
import {useSelector} from "react-redux"
import {useHistory, useRouteMatch} from "react-router"
import Feature from "src/js/state/Feature"
import Label from "./label"
import SwitchButton from "./switch-button"
import Option from "./switch-button-option"

export default function MainViewSwitch() {
  const match = useRouteMatch()
  const lakeId = useLakeId()
  const workspaceId = useWorkspaceId()
  const history = useHistory()

  let value = ""
  if (match.path === lakeSearch.path) value = "search"
  if (match.path === lakeSummary.path) value = "summary"

  const onChange = (view) => {
    let url
    if (view === "search") url = lakeSearchPath(lakeId, workspaceId)
    if (view === "summary") url = lakeSummaryPath(lakeId, workspaceId)
    url && history.push(url)
  }

  if (!useSelector(Feature.show("summary"))) return null

  return (
    <div>
      <SwitchButton value={value} onChange={onChange}>
        <Option value="summary" title="Switch to Summary View">
          <Icon name="grid" size={16} />
        </Option>
        <Option value="search" title="Switch to Search View">
          <Icon name="list" size={16} />
        </Option>
      </SwitchButton>
      <Label>{capitalize(value)}</Label>
    </div>
  )
}

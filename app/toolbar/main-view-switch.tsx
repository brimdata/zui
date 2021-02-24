import Icon from "app/core/Icon"
import useLakeId from "app/router/hooks/use-lake-id"
import useWorkspaceId from "app/router/hooks/use-workspace-id"
import {lakeSearchPath, lakeSummaryPath} from "app/router/utils/paths"
import {capitalize} from "lodash"
import React from "react"
import {useRouteMatch} from "react-router"
import Label from "./label"
import SwitchButton from "./switch-button"
import Option from "./switch-button-option"

export default function MainViewSwitch() {
  const match = useRouteMatch()
  const parts = match.url.split("/")
  const lakeId = useLakeId()
  const workspaceId = useWorkspaceId()
  const [view] = parts.splice(parts.length - 1)
  const value = /search/.test(view) ? "search" : "summary"
  const onChange = (view) => {
    let url
    if (view === "search") url = lakeSearchPath(lakeId, workspaceId)
    if (view === "summary") url = lakeSummaryPath(lakeId, workspaceId)
    url && global.tabHistory.push(url)
  }

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

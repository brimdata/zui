import Icon from "app/core/Icon"
import {capitalize} from "lodash"
import React from "react"
import Label from "./label"
import SwitchButton from "./switch-button"
import Option from "./switch-button-option"
import {useRouteMatch} from "react-router"

export default function MainViewSwitch() {
  const match = useRouteMatch()
  const parts = match.url.split("/")
  const [view] = parts.splice(parts.length - 1)
  const value = view === "search" ? "search" : "summary"
  const onChange = (view) => {
    const url = parts.join("/") + "/" + view
    global.tabHistory.push(url)
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

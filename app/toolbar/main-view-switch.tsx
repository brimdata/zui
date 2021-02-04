import Icon from "app/core/Icon"
import {capitalize} from "lodash"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import Layout from "src/js/state/Layout"
import Label from "./label"
import SwitchButton from "./switch-button"
import Option from "./switch-button-option"
import Feature from "src/js/state/Feature"

export default function MainViewSwitch() {
  const dispatch = useDispatch()
  const value = useSelector(Layout.getMainView)
  const onChange = (v) => dispatch(Layout.setMainView(v))
  const show = useSelector(Feature.show("summary"))

  if (show) {
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
  } else {
    return null
  }
}

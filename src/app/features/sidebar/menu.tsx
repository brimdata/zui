import React from "react"
import {useDispatch} from "src/app/core/state"
import {useSelector} from "react-redux"
import Appearance from "src/js/state/Appearance"
import {SectionName} from "src/js/state/Appearance/types"
import {SectionTabs} from "src/components/section-tabs"

export function Menu() {
  const dispatch = useDispatch()
  const currentSectionName = useSelector(Appearance.getCurrentSectionName)

  return (
    <SectionTabs
      value={currentSectionName}
      onChange={(name) => {
        console.log("onChange", name)
        dispatch(Appearance.setCurrentSectionName(name as SectionName))
      }}
      options={[
        {label: "Pools", value: "pools"},
        {label: "Queries", value: "queries"},
      ]}
    />
  )
}

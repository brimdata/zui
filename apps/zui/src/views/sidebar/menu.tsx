import React from "react"
import {useDispatch} from "src/core/use-dispatch"
import {useSelector} from "react-redux"
import Appearance from "src/js/state/Appearance"
import {SectionName} from "src/js/state/Appearance/types"
import {SectionTabs} from "src/components/section-tabs"

export function Menu() {
  const dispatch = useDispatch()
  const currentSectionName = useSelector(Appearance.getCurrentSectionName)
  const makeOption = (name: string, value: SectionName) => ({
    label: name,
    checked: value === currentSectionName,
    click: () => {
      dispatch(Appearance.setCurrentSectionName(value))
    },
  })
  return (
    <div
      className="h-toolbar border-b-solid border-more gutter"
      style={{"--gutter-space": "var(--half-gutter)"} as any}
    >
      <SectionTabs
        options={[
          makeOption("Pools", "pools"),
          makeOption("Queries", "queries"),
        ]}
      />
    </div>
  )
}

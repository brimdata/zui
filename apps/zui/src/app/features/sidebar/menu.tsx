import React from "react"
import {useDispatch} from "src/app/core/state"
import {useSelector} from "react-redux"
import Appearance from "src/js/state/Appearance"
import {SectionName} from "src/js/state/Appearance/types"
import {SectionTabs} from "src/components/section-tabs"
import styled from "styled-components"

const BG = styled.div`
  height: 36px;
  padding: 0 8px;
`

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
    <BG>
      <SectionTabs
        options={[
          makeOption("Pools", "pools"),
          makeOption("Queries", "queries"),
        ]}
      />
    </BG>
  )
}

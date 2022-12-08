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

  return (
    <BG>
      <SectionTabs
        value={currentSectionName}
        onChange={(name) => {
          dispatch(Appearance.setCurrentSectionName(name as SectionName))
        }}
        options={[
          {label: "Pools", value: "pools"},
          {label: "Queries", value: "queries"},
        ]}
      />
    </BG>
  )
}

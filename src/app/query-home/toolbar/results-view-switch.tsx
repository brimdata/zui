import React from "react"
import {SwitchButton} from "src/app/core/components/switch-button"
import styled from "styled-components"
import {useResultsView} from "../results/view-hook"

const BG = styled.div`
  margin-top: 8px;
`

export function ResultsViewSwitch() {
  const view = useResultsView()
  return (
    <BG>
      <SwitchButton
        minWidth={70}
        options={[
          {label: "Table", click: view.setTable, active: view.isTable},
          {
            label: "Inspector",
            click: view.setInspector,
            active: view.isInspector,
          },
        ]}
      />
    </BG>
  )
}

import React from "react"
import {SwitchButton} from "src/app/core/components/switch-button"
import styled from "styled-components"
import {useResultsView} from "../results/view-hook"
import Label from "./actions/label"

const BG = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 0;z
`

export function ResultsViewSwitch() {
  const view = useResultsView()
  return (
    <BG>
      <SwitchButton
        minWidth={80}
        options={[
          {label: "Table", click: view.setTable, active: view.isTable},
          {
            label: "Inspector",
            click: view.setInspector,
            active: view.isInspector,
          },
        ]}
      />
      <Label isDisabled={false}>View</Label>
    </BG>
  )
}

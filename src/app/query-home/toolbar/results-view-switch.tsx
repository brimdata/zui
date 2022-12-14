import React, {startTransition} from "react"
import {useSelector} from "react-redux"
import useKeybinding from "src/app/core/hooks/use-keybinding"
import {useDispatch} from "src/app/core/state"
import {SectionTabs} from "src/components/section-tabs"
import Layout from "src/js/state/Layout"
import {ResultsView} from "src/js/state/Layout/types"
import styled from "styled-components"

const BG = styled.div`
  height: 100%;
`
const INSPECTOR = "INSPECTOR"
const TABLE = "TABLE"

export function ResultsViewSwitch() {
  const dispatch = useDispatch()
  const view = useSelector(Layout.getResultsView)

  const setView = (view: ResultsView) => {
    startTransition(() => {
      dispatch(Layout.setResultsView(view as ResultsView))
    })
  }

  useKeybinding("ctrl+d", () => {
    setView(view === TABLE ? INSPECTOR : TABLE)
  })

  return (
    <BG>
      <SectionTabs
        value={view}
        onChange={setView}
        options={[
          {label: "Table", value: TABLE},
          {label: "Inspector", value: INSPECTOR},
        ]}
      />
    </BG>
  )
}

import {createSelector} from "@reduxjs/toolkit"
import {getData} from "./selectors"
import {createIsEqualSelector} from "../utils"

export const getIdAndTitle = createSelector(getData, (tabs) => {
  return tabs.map((tab) => ({id: tab.id, title: tab.title}))
})

export const getTabDisplayProps = createIsEqualSelector(
  getIdAndTitle,
  (props) => props
)

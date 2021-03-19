import {createSelector} from "@reduxjs/toolkit"
import Current from "../Current"

const getSnapshot = createSelector(Current.getSpace, (space) => {
  return space.ingest.snapshot
})

export default {
  getSnapshot
}

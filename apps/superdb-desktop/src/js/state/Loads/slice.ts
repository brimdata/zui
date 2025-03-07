import {LoadReference} from "./types"
import {createEntitySlice} from "../entity-slice/create-entity-slice"

export const slice = createEntitySlice<LoadReference>({
  name: "$INGESTS",
  select: (state: any) => state.loads,
})

import {State} from "../types"

export type FeatureName = "summary"
export type FeatureState = {[name: string]: boolean}

function reducer(state = {summary: true}, action) {
  switch (action.type) {
    case "FEATURE_SET":
      return {...state, [action.name]: action.status}
    default:
      return state
  }
}

const show = (name: FeatureName) => (state: State) => state.feature[name]

const set = (name: FeatureName, status: boolean) => ({
  type: "FEATURE_SET",
  name,
  status
})

export default {reducer, show, set}

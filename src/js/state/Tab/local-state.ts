import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {useDispatch, useSelector} from "react-redux"
import activeTabSelect from "./activeTabSelect"

type SetValueAction = PayloadAction<{key: string; value: any}>

export const tabLocalStateSlice = createSlice({
  name: "TAB_LOCAL_STATE",
  initialState: {} as {[key: string]: any},
  reducers: {
    setValue(s, action: SetValueAction) {
      s[action.payload.key] = action.payload.value
    }
  }
})

const {actions} = tabLocalStateSlice

function getTabLocalState(key: string) {
  return activeTabSelect((tab) => tab.localState[key])
}

export function useTabState<T>(key: string, defaultValue: T) {
  const dispatch = useDispatch()
  const stored = useSelector(getTabLocalState(key))
  const value = stored === undefined ? defaultValue : stored

  const setValue = (newValue: T) => {
    dispatch(actions.setValue({key, value: newValue}))
  }

  return [value, setValue]
}

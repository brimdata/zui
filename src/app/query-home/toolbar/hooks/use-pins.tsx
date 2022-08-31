import {createTimeRange} from "src/app/commands/pins"
import {useDispatch} from "src/app/core/state"
import {showContextMenu} from "src/js/lib/System"
import Editor from "src/js/state/Editor"
import {Thunk} from "src/js/state/types"
import submitSearch from "../../flows/submit-search"
import popupPosition from "../../search-area/popup-position"
import {ActionButtonProps} from "../actions/action-button"

const showPinsMenu =
  (anchor): Thunk =>
  (dispatch, getState) => {
    const pins = Editor.getPins(getState())
    const value = Editor.getValue(getState())
    const pinCurrent = {
      label: "Pin Editor Value",
      enabled: !!value.trim(),
      click: () => {
        dispatch(Editor.pinValue())
        dispatch(submitSearch())
      },
    }
    const newGeneric = {
      label: "New 'Generic' Pin",
      click: () => {
        dispatch(Editor.addPin({type: "generic", value: ""}))
        dispatch(Editor.editPin(pins.length))
      },
    }
    const newFrom = {
      label: "New 'From' Pin",
      click: () => {
        dispatch(Editor.addPin({type: "from", value: ""}))
        dispatch(Editor.editPin(pins.length))
      },
    }
    const newTimeRange = {
      label: "New 'Time Range' Pin",
      click: () => createTimeRange.run(),
    }
    showContextMenu(
      [pinCurrent, {type: "separator"}, newGeneric, newFrom, newTimeRange],
      popupPosition(anchor)
    )
  }

const usePins = (): ActionButtonProps => {
  const dispatch = useDispatch()
  return {
    label: "Pins",
    title: "Pin current search term",
    icon: "pin",
    submenu: [], // Move that above function into this, change the click handler to get the submenu
    click: (e) => {
      dispatch(showPinsMenu(e?.target))
    },
  }
}

export default usePins

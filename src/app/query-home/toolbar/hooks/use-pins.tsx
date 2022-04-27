import {useDispatch} from "react-redux"
import {showContextMenu} from "src/js/lib/System"
import Editor from "src/js/state/Editor"
import popupPosition from "../../search-area/popup-position"
import {ActionButtonProps} from "../action-button"

const showPinsMenu = (anchor) => (dispatch, getState) => {
  const pins = Editor.getPins(getState())
  const pinCurrent = {
    label: "Pin Editor Value",
    click: () => dispatch(Editor.pinValue())
  }
  const newGeneric = {
    label: "New 'Generic' Pin",
    click: () => {
      dispatch(Editor.addPin({type: "generic", value: ""}))
      dispatch(Editor.editPin(pins.length))
    }
  }
  const newFrom = {
    label: "New 'From' Pin",
    click: () => {
      dispatch(Editor.addPin({type: "from", value: ""}))
      dispatch(Editor.editPin(pins.length))
    }
  }
  const newTimeRange = {
    label: "New 'Time Range' Pin",
    click: () => {
      dispatch(
        Editor.addPin({
          type: "time-range",
          from: new Date(),
          to: new Date()
        })
      )
      dispatch(Editor.editPin(pins.length))
    }
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
    submenu: [],
    click: (e) => {
      dispatch(showPinsMenu(e.target))
    }
  }
}

export default usePins

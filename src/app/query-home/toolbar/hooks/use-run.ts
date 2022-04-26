import submitSearch from "src/app/query-home/flows/submit-search"
import {useDispatch} from "src/app/core/state"
import {ActionButtonProps} from "../action-button"

export default function useRun(): ActionButtonProps {
  const dispatch = useDispatch()

  return {
    label: "Run",
    title: "Execute query",
    icon: "run",
    click: () => dispatch(submitSearch()),
  }
}

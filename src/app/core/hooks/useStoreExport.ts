/*
useStoreExport listens to redux store state changes and 'exports' that data via brim-commands
 */
import {useEffect} from "react"
import {useSelector} from "react-redux"
import LogDetails from "src/js/state/LogDetails"
import Viewer from "src/js/state/Viewer"
import {encode} from "@brimdata/zealot"
import {executeCommand} from "src/js/flows/executeCommand"
import {useDispatch} from "../state"

const useStoreExport = () => {
  const currentData = useSelector(LogDetails.build)
  const dispatch = useDispatch()

  const zjson = currentData ? encode(currentData) : null

  useEffect(() => {
    dispatch(executeCommand("data-detail:current", zjson))
  }, [currentData])

  const selectedData = useSelector(Viewer.getSelectedRecords)
  useEffect(() => {
    dispatch(
      executeCommand(
        "data-detail:selected",
        selectedData.length > 0 ? selectedData[0] : null
      )
    )
  }, [selectedData])
}

export default useStoreExport

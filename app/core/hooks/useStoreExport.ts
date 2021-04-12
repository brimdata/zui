/*
useStoreExport listens to redux store state changes and 'exports' that data via brim-commands
 */
import {useEffect} from "react"
import {useSelector} from "react-redux"
import LogDetails from "src/js/state/LogDetails"
import Viewer from "src/js/state/Viewer"

const useStoreExport = () => {
  const currentData = useSelector(LogDetails.build)
  useEffect(() => {
    global.executeCommand("data-detail:current", currentData?.serialize())
  }, [currentData])

  const selectedData = useSelector(Viewer.getSelectedRecords)
  useEffect(() => {
    global.executeCommand(
      "data-detail:selected",
      selectedData.length > 0 ? selectedData[0] : null
    )
  }, [selectedData])
}

export default useStoreExport

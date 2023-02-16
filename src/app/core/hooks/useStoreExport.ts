/*
useStoreExport listens to redux store state changes and 'exports' that data via brim-commands
 */
import {useEffect} from "react"
import {useSelector} from "react-redux"
import LogDetails from "src/js/state/LogDetails"
import {executeCommand} from "src/js/flows/executeCommand"
import {useDispatch} from "../state"

const useStoreExport = () => {
  const currentData = useSelector(LogDetails.build)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(executeCommand("data-detail:current", currentData))
  }, [currentData])
}

export default useStoreExport

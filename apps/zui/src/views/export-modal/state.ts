import {useState} from "react"
import {useSelector} from "react-redux"
import {MenuItem} from "src/core/menu"
import Results from "src/js/state/Results"
import {RESULTS_QUERY_COUNT} from "../results-pane/run-results-query"

export function useExportModalState() {
  const [dest, setDest] = useState("file")
  const [poolId, setPoolId] = useState("new")
  const countStatus = useSelector(Results.getStatus(RESULTS_QUERY_COUNT))
  const count = useSelector(Results.getValues(RESULTS_QUERY_COUNT))[0]?.toJS()
  const [isCopying, setIsCopying] = useState(false)
  const toPool = dest === "pool"
  const toFile = dest === "file"
  const newPool = poolId === "new"
  const tabs = [
    {
      label: "File",
      iconName: "file_border",
      checked: dest === "file",
      click: () => setDest("file"),
    },
    {
      label: "Pool",
      iconName: "pool",
      checked: dest == "pool",
      click: () => setDest("pool"),
    },
  ] as MenuItem[]

  return {
    isCopying,
    setIsCopying,
    tabs,
    toPool,
    toFile,
    newPool,
    setPoolId,
    dest,
    setDest,
    count,
    countStatus,
  }
}

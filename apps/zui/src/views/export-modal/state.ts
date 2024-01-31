import {useState} from "react"
import {MenuItem} from "src/core/menu"

export function useExportModalState() {
  const [dest, setDest] = useState("file")
  const [poolId, setPoolId] = useState("new")
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
    tabs,
    toPool,
    toFile,
    newPool,
    setPoolId,
    dest,
    setDest,
  }
}

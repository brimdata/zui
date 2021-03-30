import BrimApi from "../src/js/initializers/brimApi"

export const activate = (brim: BrimApi) => {
  handleBrimcapButtons(brim)
  // handleBrimcapImport(ctx)
}

const cleanupFns: Function[] = []
const handleBrimcapButtons = (brim) => {
  const itemIdentifier = "wireshark-button"
  const brimcapDownloadCmd = "brimcap-download-packets"
  const itemOptions = {
    id: itemIdentifier,
    label: "Packets",
    icon: "", // import icon
    disabled: false,
    tooltip: "",
    command: brimcapDownloadCmd
  }

  brim.toolbar.add("search", itemOptions)
  cleanupFns.push(
    brim.commands.add(brimcapDownloadCmd, (buttonData) => {
      // actually execute brimcap
      console.log(buttonData)
    })
  )

  cleanupFns.push(
    brim.commands.add("viewer:result-selected", (data) => {
      console.log(data)
      // inspect data, if not wireshark-compatible then...
      brim.toolbar.update("search", itemIdentifier, {disabled: true})
    })
  )
}

export const deactivate = () => cleanupFns.forEach((fn) => fn())

// const handleBrimcapImport = () => {
// better name for event?
// brim.addListener("source-import:file-selected", (filename) => {
// use zealot to create space, use 'brimcap load'
// })
// }

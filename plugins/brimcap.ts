import {fetchCorrelation} from "../ppl/detail/flows/fetch"
import {downloadPcap} from "../src/js/flows/downloadPcap"
import BrimApi from "../src/js/initializers/brimApi"
import {zng} from "../zealot"
import {Record} from "../zealot/zng"
import commandExists from "command-exists"

// currentData represents the data detail currently seen in the Brim detail pane/window
let currentConn = null
// selectedData represents the data detail currently selected and highlighted in the search viewer
let selectedConn = null

export const activate = (brim: BrimApi) => {
  commandExists("brimcap")
    .then(() => {
      setupBrimcapButtons(brim)
      // TODO: handle pcap import, contextMenu items, and detail pane/window correlation UI
    })
    .catch(() => {
      console.error(
        "The brimcap plugin requires the 'brimcap' CLI tool to also be installed. Please download it here: https://github.com/brimdata/brimcap/releases"
      )
    })
}

const cleanupFns: Function[] = []
const setupBrimcapButtons = (brim) => {
  const searchButtonId = "wireshark-button:search"
  const detailButtonId = "wireshark-button:detail"

  const brimcapDownloadSelectedCmd = "brimcap-download-packets:selected"
  const brimcapDownloadCurrentCmd = "brimcap-download-packets:current"

  const itemOptions = {
    label: "Packets",
    icon: "sharkfin", // TODO: enable ability for plugins to provide and use their own assets
    disabled: true,
    tooltip: "No connection record found."
  }

  // TODO: fetchCorrelation should eventually be owned by the brimcap plugin and the dispatch here won't be needed
  const tryConn = async (detail: zng.Record, eventId: string) => {
    const uidRecords = await brim.store.dispatch(
      fetchCorrelation(detail, eventId)
    )
    return uidRecords.find((log) => log.try("_path")?.toString() === "conn")
  }

  const setButtonDetails = (
    toolbarId: string,
    buttonId: string,
    isDisabled: boolean
  ) => {
    brim.toolbar.update(toolbarId, buttonId, {
      disabled: isDisabled,
      tooltip: isDisabled
        ? "No connection record found."
        : "Open packets from this connection."
    })
  }

  const updateButtonStatus = (
    toolbarId: string,
    buttonId: string,
    data: zng.Record,
    setConn: (conn: zng.Record) => {}
  ) => {
    tryConn(data, buttonId)
      .then((conn) => {
        setConn(conn)
        setButtonDetails(toolbarId, buttonId, !conn)
      })
      .catch((err) => {
        console.error(err)
        setConn(null)
        setButtonDetails(toolbarId, buttonId, true)
      })
  }

  // add brimcap buttons to search and detail toolbars
  brim.toolbar.add("search", {
    ...itemOptions,
    id: searchButtonId,
    command: brimcapDownloadSelectedCmd
  })
  brim.toolbar.add("detail", {
    ...itemOptions,
    id: detailButtonId,
    command: brimcapDownloadCurrentCmd
  })

  // add click handlers for button's emitted commands
  // TODO: use 'brimcap' CLI instead of zqd
  cleanupFns.push(
    brim.commands.add(
      brimcapDownloadSelectedCmd,
      () => selectedConn && brim.store.dispatch(downloadPcap(selectedConn))
    ),
    brim.commands.add(
      brimcapDownloadCurrentCmd,
      () => currentConn && brim.store.dispatch(downloadPcap(currentConn))
    )
  )

  // add brim-command listeners to update button statuses
  cleanupFns.push(
    // the detail window's packets button will operate off of the 'current' record
    brim.commands.add("data-detail:current", ([record]) => {
      if (!record) return
      const data = Record.deserialize(record)

      updateButtonStatus(
        "detail",
        detailButtonId,
        data,
        (conn) => (currentConn = conn)
      )
    }),
    // the search window's packets button operates off of the 'selected' record
    // (whatever is highlighted in the viewer/table)
    brim.commands.add("data-detail:selected", ([data]) => {
      if (!data) return
      updateButtonStatus(
        "search",
        searchButtonId,
        data,
        (conn) => (selectedConn = conn)
      )
    })
  )
}

export const deactivate = () => cleanupFns.forEach((fn) => fn())

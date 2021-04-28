import {DateTimeFormatter, LocalDateTime, ZoneOffset} from "@js-joda/core"
import os from "os"
import path, {join} from "path"
import {fetchCorrelation} from "../../ppl/detail/flows/fetch"
import open from "../../src/js/lib/open"
import {AppDispatch} from "../../src/js/state/types"
import {zng} from "../../zealot"
import {Record} from "../../zealot/zng"
import BrimcapCLI, {searchOptions} from "./brimcap-cli"
import BrimApi from "../../src/js/api"
import {IngestParams} from "../../src/js/brim/ingest/getParams"
import fsExtra, {pathExistsSync} from "fs-extra"
import errors from "src/js/errors"
import {reactElementProps} from "../../src/js/test/integration"

export default class BrimcapPlugin {
  private cli: BrimcapCLI
  // currentData represents the data detail currently seen in the Brim detail pane/window
  private currentConn = null
  // selectedData represents the data detail currently selected and highlighted in the search viewer
  private selectedConn = null
  private cleanupFns: Function[] = []
  private brimcapDataRoot = ""
  private brimcapBinPath = ""
  private toastConfig = {
    loading: {
      // setTimeout's maximum value is a 32-bit int, so we explicitly specify here
      // also, once https://github.com/timolins/react-hot-toast/pull/37 merges, we can set this to -1
      duration: 2 ** 31 - 1
    },
    success: {
      duration: 3000
    },
    error: {
      duration: 5000
    }
  }

  constructor(private api: BrimApi) {
    // RFC: what interface do we want the app to provide for this sort of data?
    const {dataRoot, zdepsDirectory} = api.getAppConfig()

    this.brimcapBinPath = path.join(zdepsDirectory, "brimcap")
    this.cli = new BrimcapCLI(this.brimcapBinPath)

    this.brimcapDataRoot = path.join(dataRoot, "brimcap-root")
  }

  public init() {
    fsExtra.ensureDirSync(this.brimcapDataRoot)

    if (!pathExistsSync(this.brimcapBinPath)) {
      console.error(
        "The brimcap plugin requires the 'brimcap' CLI tool to also be installed. Please download it here: https://github.com/brimdata/brimcap/releases"
      )
      return
    }

    this.setupBrimcapButtons()
    this.setupLoader()

    // TODO: handle contextMenu items, and detail pane/window correlation UI
  }

  private async tryConn(detail: zng.Record, eventId: string) {
    // TODO: dispatch is only temporarily public to plugins, so this won't always be needed
    const dispatch = this.api.dispatch as AppDispatch
    const uidRecords = await dispatch(fetchCorrelation(detail, eventId))

    return uidRecords.find((log) => log.try("_path")?.toString() === "conn")
  }

  private setupBrimcapButtons() {
    const searchButtonId = "wireshark-button:search"
    const detailButtonId = "wireshark-button:detail"
    const brimcapDownloadSelectedCmd = "brimcap-download-packets:selected"
    const brimcapDownloadCurrentCmd = "brimcap-download-packets:current"

    const itemOptions = {
      label: "Packets",
      icon: "sharkfin", // TODO: enable plugins to provide their own assets
      disabled: true,
      tooltip: "No connection record found.",
      order: 0,
      buttonProps: reactElementProps("pcapsButton")
    }

    const setButtonDetails = (
      toolbarId: string,
      buttonId: string,
      isDisabled: boolean
    ) => {
      this.api.toolbar.update(toolbarId, buttonId, {
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
      this.tryConn(data, buttonId)
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
    this.api.toolbar.add("search", {
      ...itemOptions,
      id: searchButtonId,
      command: brimcapDownloadSelectedCmd
    })
    this.api.toolbar.add("detail", {
      ...itemOptions,
      id: detailButtonId,
      command: brimcapDownloadCurrentCmd
    })

    // add click handlers for button's emitted commands
    this.cleanupFns.push(
      this.api.commands.add(brimcapDownloadSelectedCmd, () => {
        this.selectedConn && this.downloadPcap(this.selectedConn)
      }),
      this.api.commands.add(
        brimcapDownloadCurrentCmd,
        () => this.currentConn && this.downloadPcap(this.currentConn)
      )
    )

    // add brim-command listeners to update button statuses
    this.cleanupFns.push(
      // the detail window's packets button will operate off of the 'current' record
      this.api.commands.add("data-detail:current", ([record]) => {
        if (!record) return
        const data = Record.deserialize(record)

        updateButtonStatus(
          "detail",
          detailButtonId,
          data,
          (conn) => (this.currentConn = conn)
        )
      }),
      // the search window's packets button operates off of the 'selected' record
      // (whatever is highlighted in the viewer/table)
      this.api.commands.add("data-detail:selected", ([data]) => {
        if (!data) return
        updateButtonStatus(
          "search",
          searchButtonId,
          data,
          (conn) => (this.selectedConn = conn)
        )
      })
    )
  }

  private logToSearchOpts(log: zng.Record): searchOptions {
    const ts = log.get("ts") as zng.Primitive
    // RFC3999nano format with zero timezone offset
    const formatter = DateTimeFormatter.ofPattern(
      "yyyy-MM-dd'T'HH:mm:ss.SSSSSSSSS'Z'"
    )
    const tsString = LocalDateTime.ofEpochSecond(
      getSec(ts),
      getNs(ts),
      ZoneOffset.UTC
    )
      .format(formatter)
      .toString()

    const dur = log.get("duration") as zng.Primitive
    const dest = join(this.api.getTempDir(), `packets-${ts.toString()}.pcap`)

    return {
      dstIp: log.get("id.resp_h").toString(),
      dstPort: log.get("id.resp_p").toString(),
      duration: `${dur.toFloat()}s`,
      proto: log.get("proto").toString(),
      root: this.brimcapDataRoot,
      srcIp: log.get("id.orig_h").toString(),
      srcPort: log.get("id.orig_p").toString(),
      ts: tsString,
      write: dest
    }
  }

  private async downloadPcap(log: zng.Record) {
    const searchOpts = this.logToSearchOpts(log)

    const searchAndOpen = async () => {
      await this.cli.search(searchOpts)
      return open(searchOpts.write, {newWindow: true})
    }

    this.api.toast.promise(
      searchAndOpen(),
      {
        loading: "Preparing PCAP...",
        success: "Preparation Complete",
        error: (err) => {
          console.error(err)
          return "Error Preparing PCAP"
        }
      },
      this.toastConfig
    )
  }

  private setupLoader() {
    const load = async (
      params: IngestParams & {spaceId: string},
      onProgressUpdate: (value: number | null) => void,
      onWarning: (warning: string) => void,
      onDetailUpdate: () => void
    ): Promise<void> => {
      const {fileListData, name} = params
      if (fileListData.length > 1)
        throw new Error("Only one pcap can be opened at a time.")

      const paths = fileListData.map((f) => f.file.path)

      const p = this.cli.load(paths[0], {
        root: this.brimcapDataRoot,
        space: name
      })

      let brimcapErr
      p.on("error", (err) => {
        brimcapErr = err
      })

      onProgressUpdate(0)
      p.stderr.on("data", async (d) => {
        const msg = JSON.parse(d)
        const {type, ...status} = msg
        switch (type) {
          case "status":
            onProgressUpdate(statusToPercent(status))
            await onDetailUpdate()
            break
          case "warning":
            if (status.warning) onWarning(status.warning)
            break
          case "error":
            if (status.error) brimcapErr = status.error
        }
      })

      // wait for process to end
      await new Promise((res) => {
        p.on("close", async () => {
          res()
        })
      })

      if (brimcapErr) throw errors.pcapIngest(brimcapErr)

      await onDetailUpdate()
      onProgressUpdate(1)
      onProgressUpdate(null)
    }

    this.api.loaders.add({
      load,
      match: "pcap"
    })
  }

  public cleanup() {
    this.cleanupFns.forEach((fn) => fn())
  }
}

// helpers

function statusToPercent(status): number {
  if (status.pcap_total_size === 0) return 1
  else return status.pcap_read_size / status.pcap_total_size || 0
}

function getSec(data: zng.Primitive): number {
  if (data.isSet()) {
    return parseInt(data.getValue().split(".")[0])
  } else {
    return 0
  }
}

function getNs(data: zng.Primitive): number {
  if (data.isSet()) {
    const v = data.getValue().split(".")
    if (v.length === 2) {
      const frac = v[1]
      const digits = frac.length
      return parseInt(frac) * Math.pow(10, 9 - digits)
    }
  }
  return 0
}

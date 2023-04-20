import * as zed from "@brimdata/zed-js"

export function downloadPcap(log: zed.Record) {
  let searchOpts
  try {
    searchOpts = this.logToSearchOpts(log)
  } catch (e) {
    console.error(e)
    this.api.toast.error(
      "Flow's 5-tuple and/or time span was not found in the connection record"
    )
    return
  }

  const searchAndOpen = async () => {
    const res = await this.cli.search(searchOpts)
    if (res.status > 0) {
      const err = res.stderr.toString()
      const msg = JSON.parse(err)?.error || `brimcap search failed: ${err}`

      throw new Error(msg)
    }

    return await open(searchOpts.write, {newWindow: true})
  }

  this.api.toast.promise(
    searchAndOpen(),
    {
      loading: "Preparing pcap...",
      success: "Preparation complete",
      error: (err) => {
        console.error(err)
        return "Error preparing pcap: " + err.message
      },
    },
    this.toastConfig
  )
}

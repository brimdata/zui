import BrimApi from "../../src/js/api"
import {IngestParams} from "../../src/js/brim/ingest/getParams"
import errors from "../../src/js/errors"
import {forEach} from "lodash"

export const activate = (api: BrimApi) => {
  const load = async (
    params: IngestParams & {poolId: string},
    onProgressUpdate: (value: number | null) => void,
    onWarning: (warning: string) => void,
    onDetailUpdate: () => Promise<void>
  ): Promise<void> => {
    const {poolId, fileListData} = params
    const client = api.getZealot()

    const files = fileListData.map((f) => f.file)

    const stream = await client.logs.post({poolId, files})

    onProgressUpdate(0)
    // @ts-ignore
    for await (const {type, ...status} of stream) {
      switch (type) {
        case "UploadProgress":
          onProgressUpdate(status.progress)
          await onDetailUpdate()
          break
        case "LogPostResponse":
          await onDetailUpdate()
          forEach(status.warnings, onWarning)
          break
        case "LogPostWarning":
          onWarning(status.warning)
          break
        case "TaskEnd":
          if (status.error) {
            throw errors.logsIngest(status.error.error)
          }
          break
      }
    }

    await onDetailUpdate()
    onProgressUpdate(1)
    onProgressUpdate(null)
  }

  api.loaders.add({
    load,
    match: "log"
  })
}

export const deactivate = () => {}

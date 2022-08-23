import {meta} from "src/app/ipc/meta"
import {paths} from "src/app/ipc/paths"
import {serve} from "src/pkg/electron-ipc-service"

export function initialize(_: any) {
  serve(paths)
  serve(meta)
}

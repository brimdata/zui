import {FileListData} from "./fileList"
import detectFileType from "./detectFileType"

export default function(paths: string[]): Promise<FileListData> {
  return Promise.all(
    paths.map(async (path) => {
      const type = await detectFileType(path)
      return {type, path}
    })
  )
}

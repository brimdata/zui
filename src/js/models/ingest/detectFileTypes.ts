import {FileListData} from "./fileList"
import detectFileType from "./detectFileType"

export default function (filePaths: string[]): Promise<FileListData> {
  return Promise.all(
    filePaths.map(async (file) => {
      const type = await detectFileType(file)
      return {type, file}
    })
  )
}

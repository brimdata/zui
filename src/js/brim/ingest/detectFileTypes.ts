import {FileListData} from "./fileList"
import detectFileType from "./detectFileType"

export default function(files: File[]): Promise<FileListData> {
  return Promise.all(
    files.map(async (file) => {
      const type = await detectFileType(file.path)
      return {type, file}
    })
  )
}

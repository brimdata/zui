import fs from "fs"
import {Thunk} from "../state/types"
import {JSONGroup} from "../state/Queries/parsers"

export default (filePath: string, group: JSONGroup): Thunk<Promise<string>> =>
  (): Promise<string> => {
    return new Promise((res, rej) => {
      try {
        fs.writeFileSync(filePath, JSON.stringify(group))
        res(filePath)
      } catch (e) {
        rej(e)
      }
    })
  }

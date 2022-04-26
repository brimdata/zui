import fs from "fs"
import SystemTest from "../state/SystemTest"
import {Thunk} from "../state/types"
import {Group} from "../state/Queries/types"

export default (
    filePath: string,
    group: Partial<Group>
  ): Thunk<Promise<string>> =>
  (dispatch): Promise<string> => {
    return new Promise((res, rej) => {
      try {
        fs.writeFileSync(filePath, JSON.stringify(group))
        res(filePath)
        dispatch(SystemTest.hook("queries-export-complete"))
      } catch (e) {
        rej(e)
      }
    })
  }

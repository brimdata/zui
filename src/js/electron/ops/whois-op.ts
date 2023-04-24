import {createOperation} from "../../../core/operations"
import {exec} from "child_process"

export const whoisOp = createOperation("whoisOp", (_, addr) => {
  return new Promise<any>((resolve, reject) => {
    exec(`whois ${addr}`, (error, stdout, _stderr) => {
      if (error) {
        reject(error.toString())
      } else {
        resolve(stdout)
      }
    })
  })
})

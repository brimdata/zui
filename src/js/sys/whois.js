/* @flow */
import {exec} from "child_process"

export default function whois(addr: string) {
  return new Promise<*>((resolve, reject) => {
    exec(`whois ${addr}`, (error, stdout, _stderr) => {
      if (error) {
        reject(error.toString())
      } else {
        resolve(stdout)
      }
    })
  })
}

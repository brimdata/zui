/* @flow */

import opn from "opn"
import downloads from "./downloadsDir"
import {exec} from "child_process"

export const open = (path: string) => {
  return opn(path)
}

export const downloadsDir = () => {
  return downloads()
}

export const whois = (addr: string) => {
  return new Promise<string>((resolve, reject) => {
    exec(`whois ${addr}`, (error, stdout, _stderr) => {
      if (error) {
        reject(error)
      } else {
        resolve(stdout)
      }
    })
  })
}

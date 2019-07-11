/* @flow */

import opn from "opn"

import {exec} from "child_process"
import {remote} from "electron"

import downloads from "./downloadsDir"

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
        reject(error.toString())
      } else {
        resolve(stdout)
      }
    })
  })
}

export function showContextMenu(template: Object) {
  new remote.Menu.buildFromTemplate(template).popup()
}

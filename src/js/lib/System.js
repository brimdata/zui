/* @flow */

const {exec} = require("child_process")
import opn from "opn"

export const launchWireshark = () => {
  exec("wireshark ~/Desktop/pcaps")
}

export const open = (path: string) => opn(path)

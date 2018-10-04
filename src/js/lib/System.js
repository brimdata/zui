/* @flow */

import opn from "opn"
import downloads from "./downloadsDir"

export const open = (path: string) => opn(path)
export const downloadsDir = () => downloads()

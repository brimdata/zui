import {execSync} from "child_process"

const isWindows = process.platform == "win32"

function existsUnix(cmd: string): boolean {
  try {
    execSync("command -v " + cmd)
    return true
  } catch (error) {
    return false
  }
}
function existsWindows(cmd: string): boolean {
  try {
    execSync("where " + cmd)
    return true
  } catch (error) {
    return false
  }
}

function exists(cmd: string): boolean {
  if (isWindows) {
    return existsWindows(cmd)
  }
  return existsUnix(cmd)
}

export function notExists(...cmds: Array<string>): Array<string> {
  return cmds.reduce((acc, cmd) => {
    if (!exists(cmd)) {
      acc.push(cmd)
    }
    return acc
  }, [])
}

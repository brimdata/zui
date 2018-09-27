const {exec} = require("child_process")

export const launchWireshark = () => {
  exec("wireshark ~/Desktop/pcaps")
}

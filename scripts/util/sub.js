const {spawn} = require("child_process")

class Sub {
  constructor(bin, args) {
    this.p = spawn(bin, [args], {
      shell: true
    })
  }

  waitForOutput(pattern, debug) {
    return new Promise((res, rej) => {
      this.p.stdout.on("data", (d) => {
        if (debug) console.log(d.toString())
        if (pattern.test(d.toString())) res()
      })
      this.p.on("close", () => {
        rej("Process closed before receiving expected output: " + pattern)
      })
    })
  }
}

module.exports = (bin, args) => new Sub(bin, args)

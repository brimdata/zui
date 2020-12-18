const {camelCase} = require("lodash")

const parseFlags = () => {
  const [_n, _s, ...flags] = process.argv

  return flags.reduce((object, flag) => {
    object[camelCase(flag)] = true
    return object
  }, {})
}

module.exports = parseFlags()

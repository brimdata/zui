import path from "path"

class Data {
  getPath(name) {
    return path.join(__dirname, name)
  }
}

export default new Data()

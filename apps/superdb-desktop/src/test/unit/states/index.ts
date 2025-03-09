import path from "path"

class TestStates {
  getPath(name: string) {
    return path.join(__dirname, name)
  }
}

export default new TestStates()

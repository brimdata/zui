export default class StreamingListBuffer {
  constructor(listId) {
    this.listId = listId
    this.list = []
  }

  getList() {
    return this.list
  }

  append(data) {
    this.list = [...this.list, ...data]
    return this.list
  }

  clear() {
    this.list = []
  }
}

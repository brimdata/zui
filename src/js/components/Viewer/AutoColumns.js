export default class AutoColumns {
  showHeader() {
    return false
  }

  totalWidth() {
    return "auto"
  }

  colWidth() {
    return "auto"
  }

  columns(log) {
    return log.descriptor.map(d => d.name)
  }
}

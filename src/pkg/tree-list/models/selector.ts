export default class Selector {
  constructor(private size = 0, private rows = {}, private range = [0, 0]) {}

  dup() {
    return new Selector(this.size, this.rows, this.range)
  }

  clear() {
    this.rows = {}
    this.range = [0, 0]
  }

  select(index: number) {
    this.rows = {[index]: true}
    this.range = [index, index]
  }

  selectMulti(index: number) {
    const getBeginning = (index) => {
      while (index > 0) {
        if (this.isSelected(index - 1)) index--
        else break
      }
      return index
    }

    const getEnd = (index) => {
      while (index < this.size - 1) {
        if (this.isSelected(index + 1)) index++
        else break
      }
      return index
    }
    if (this.isSelected(index)) {
      const start = this.getIndices().find((i) => i > index) || 0
      const end = getEnd(start)
      this.range = [start, end]
      delete this.rows[index]
    } else {
      this.range = [getBeginning(index), getEnd(index)]
      this.commit()
    }
  }
  selectNext() {
    const next = this.isEmpty() ? 0 : Math.min(this.range[1] + 1, this.size - 1)
    return this.select(next)
  }
  selectPrev() {
    const prev = this.isEmpty() ? this.size - 1 : Math.max(this.range[0] - 1, 0)
    return this.select(prev)
  }
  selectAll() {
    this.range = [0, this.size - 1]
    this.commit(true)
  }
  selectRange(index: number) {
    this.commit(false)
    this.range[1] = index
    this.commit()
  }
  selectRangePrev() {
    const getBeginning = (index) => {
      while (index > 0) {
        if (this.isSelected(index - 1)) index--
        else break
      }
      return index
    }
    let [start, end] = this.range
    end = Math.max(0, end - 1)
    if (end < start) end = getBeginning(end)

    this.selectRange(end)
  }
  selectRangeNext() {
    const getEnd = (index) => {
      while (index < this.size - 1) {
        if (this.isSelected(index + 1)) index++
        else break
      }
      return index
    }
    let [start, end] = this.range
    end = Math.min(end + 1, this.size - 1)
    if (start < end) end = getEnd(end)

    this.selectRange(end)
  }
  getIndices() {
    return Object.entries(this.rows)
      .filter((entry) => entry[1])
      .map((entry) => parseInt(entry[0]))
  }
  isEmpty() {
    return this.getIndices().length === 0
  }
  isSelected(index) {
    return this.rows[index] === true
  }

  private commit(value = true) {
    const [start, end] = [...this.range].sort((a, b) => a - b)
    for (let i = start; i <= end; ++i) {
      if (value) this.rows[i] = value
      else delete this.rows[i]
    }
  }
}

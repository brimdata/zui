export class Position {
  constructor(public columnIndex: number, public rowIndex: number) {}

  get id() {
    return `pos:${this.columnIndex},${this.rowIndex}`
  }
}



export default class InputHistory<Entry> {

  entries: Entry[] = [];
  position = 0;

  push(newVal: Entry) {
    if (newVal !== this.entries[this.entries.length - 1]) {
      this.position = this.entries.length;
      this.entries.push(newVal);
    }
  }

  getEntries() {
    return this.entries;
  }

  getCurrentEntry(): Entry {
    return this.entries[this.position];
  }

  goBack() {
    if (this.position != 0) {
      this.position -= 1;
    }
  }

  goForward() {
    if (this.position < this.entries.length - 1) {
      this.position += 1;
    }
  }
}
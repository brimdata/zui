import { baseValue } from '../utils/base-value';
import { Record } from './record';
import { Value } from './types';

export class Field {
  constructor(
    public name: string,
    public value: Value,
    public parent: Record | Field | null
  ) {}

  /**
   * Alias for value
   */
  get data() {
    return this.value;
  }

  get path() {
    const path: string[] = [this.name];
    let parent = this.parent;
    while (parent && parent instanceof Field) {
      path.unshift(parent.name);
      parent = parent.parent;
    }
    return path;
  }

  get rootRecord() {
    let parent = this.parent;
    while (parent && parent instanceof Field) {
      parent = parent.parent;
    }
    if (parent instanceof Record) return parent;
    else return null;
  }

  get baseValue() {
    return baseValue(this.value);
  }
}

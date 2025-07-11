import * as jsup from '../jsup';
import { EncodeStream } from '../encode-stream';
import { TypeError } from '../types/type-error';
import { Value } from './types';

export class Error implements Value {
  constructor(public type: TypeError, public value: Value | null) {}

  toJS() {
    return new global.Error(this.toString());
  }

  toString(): string {
    if (this.value === null) return 'null';
    return `Error(${this.value.toString()})`;
  }

  serialize(stream: EncodeStream): jsup.Value {
    if (this.value === null) {
      return null;
    } else {
      return stream.encodeValue(this.value);
    }
  }

  isUnset(): boolean {
    return this.value === null;
  }
}

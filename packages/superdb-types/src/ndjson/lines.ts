import { parse } from './parse';
import { NEW_LINE, pipeJson } from './pipe_json';
import { pipeText } from './pipe_text';

export async function* eachLine(
  readable: ReadableStream<Uint8Array> | NodeJS.ReadableStream | null
) {
  for await (const json of pipeJson(pipeText(readable))) {
    yield json;
  }
}

export function parseLines(string: string) {
  const lines = [];
  for (const line of string.split(NEW_LINE)) {
    if (line !== '') lines.push(parse(line));
  }
  return lines;
}

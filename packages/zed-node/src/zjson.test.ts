import { zq } from './zq';
import { getPath } from '@brimdata/sample-data';
import * as zed from '@brimdata/zed-js';

const file = getPath('sample.zson');

test('super simple', async () => {
  const input: zed.zjson.Obj[] = await zq({
    input: '{hello: "world"}',
    format: 'zjson',
  });
  const decoded = zed.decode(input);
  const encoded = zed.encode(decoded);
  for (let i = 0; i < input.length; ++i) {
    expect(encoded[i]).toEqual(input[i]);
  }
});

test('super simple 2 typedefs', async () => {
  const input: zed.zjson.Obj[] = await zq({
    input: '{hello: ["world"]}',
    format: 'zjson',
  });

  const decoded = zed.decode(input);
  const encoded = zed.encode(decoded);
  for (let i = 0; i < input.length; ++i) {
    expect(encoded[i]).toEqual(input[i]);
  }
});

test('simply type value', async () => {
  const input: zed.zjson.Obj[] = await zq({
    input: '{hello: <string>}',
    format: 'zjson',
  });

  const decoded = zed.decode(input);
  const encoded = zed.encode(decoded);
  for (let i = 0; i < input.length; ++i) {
    expect(encoded[i]).toEqual(input[i]);
  }
});

test('decode, then encode', async () => {
  const input: zed.zjson.Obj[] = await zq({ file, format: 'zjson' });

  const decoded = zed.decode(input);
  const encoded = zed.encode(decoded);

  for (let i = 0; i < input.length; ++i) {
    expect(encoded[i]).toEqual(input[i]);
  }
});

test('decode, then encode a fused input', async () => {
  const input: zed.zjson.Obj[] = await zq({
    query: 'fuse',
    file,
    format: 'zjson',
  });

  const decoded = zed.decode(input);
  const encoded = zed.encode(decoded);

  for (let i = 0; i < input.length; ++i) {
    expect(encoded[i]).toEqual(input[i]);
  }
});

test('decode, encode with type values', async () => {
  const input: zed.zjson.Obj[] = await zq({
    query: '* | count() by typeof(this) | sort count, typeof',
    file,
    format: 'zjson',
  });

  expect(zed.encode(zed.decode(input))).toEqual(input);
});

test('types from one search are the same', async () => {
  const groupBy = (await zq({
    query: '* | count() by typeof(this) | sort count, typeof',
    file,
    format: 'zjson',
  })) as zed.zjson.Obj[];
  const list = (await zq({ file, format: 'zjson' })) as zed.zjson.Obj[];

  const [row1] = zed.decode(groupBy) as zed.Record[];
  const accessType = row1.get<zed.TypeValue>('typeof').value;

  const rows = zed.decode(list);
  const accessRecords = rows.filter((r) => r.type === accessType);

  expect(accessRecords.map((r) => r.toString())).toEqual([
    '{info:Access List Example,nets:[10.1.1.0/24,10.1.2.0/24]}',
  ]);
});

test('encode decode a field', async () => {
  const input: zed.zjson.Obj[] = (await zq({
    query: '*',
    file,
    format: 'zjson',
  })) as zed.zjson.Obj[];

  const records = zed.decode(input) as zed.Record[];
  expect.assertions(250);

  records.forEach((rec) => {
    rec.flatColumns.forEach((column) => {
      const field = rec.getField(column);
      if (!field) return;
      const after = zed.decode(zed.encode(field));
      expect(field).toEqual(after);
      expect(field.value.type === after.value.type).toBe(true);
    });
  });
});

test('encode decode a typeof value', async () => {
  const input: zed.zjson.Obj[] = (await zq({
    query: 'count() by typeof(this) | sort typeof',
    file,
    format: 'zjson',
  })) as zed.zjson.Obj[];

  const records = zed.decode(input) as zed.Record[];
  expect.assertions(36);

  records.forEach((rec) => {
    rec.flatColumns.forEach((column) => {
      const field = rec.getField(column);
      if (!field) return;
      const after = zed.decode(zed.encode(field));
      if (!field) return;
      expect(field).toEqual(after);
      expect(field.value.type === after.value.type).toBe(true);
    });
  });
});

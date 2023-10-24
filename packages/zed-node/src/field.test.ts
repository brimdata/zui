import { zq } from './zq';
import { DefaultContext, Record, createRecord } from '@brimdata/zed-js';

jest.setTimeout(60_000);

test('field path', () => {
  const r = createRecord({ id: { person: 'alice' } });
  const f = r.getField(['id', 'person']);

  expect(f?.value.toString()).toBe('alice');
  expect(f?.name).toBe('person');
  expect(f?.path).toEqual(['id', 'person']);
});

test('field path with nested named types', async () => {
  const objects = await zq({
    input: '{a: {b: {c: "foo"}(=c)}(=b)}(=a)',
    as: 'zjson',
  });
  const rows = DefaultContext.decode(objects) as Record[];
  const field = rows[0].getField(['a', 'b', 'c']);
  expect(field?.path).toEqual(['a', 'b', 'c']);
  expect(field?.rootRecord === rows[0]).toBe(true);
});

test('field path with nested unnamed types', async () => {
  const objects = await zq({ input: '{a: {b: {c: "foo"}}}', as: 'zjson' });
  const rows = DefaultContext.decode(objects) as Record[];
  const field = rows[0].getField(['a', 'b', 'c']);
  expect(field?.path).toEqual(['a', 'b', 'c']);
  expect(field?.rootRecord === rows[0]).toBe(true);
});

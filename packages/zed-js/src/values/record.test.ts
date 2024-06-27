import { createRecord } from '../factory';

const r = createRecord({
  status: 'pending',
  person: { name: 'alice', age: 55, geo: { lat: 1, long: 1 } },
  alert: 1,
});

test('has with array', () => {
  expect(r.has(['person', 'name'])).toBe(true);
});

test('columns', () => {
  expect(r.flatColumns).toEqual([
    'status',
    ['person', 'name'],
    ['person', 'age'],
    ['person', 'geo', 'lat'],
    ['person', 'geo', 'long'],
    'alert',
  ]);
});

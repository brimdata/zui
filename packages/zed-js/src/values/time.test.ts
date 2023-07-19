import { Time } from './time';
import { createData } from '../factory';

test('toDate()', () => {
  new Time('2020-02-25T16:03:13.987654321Z').toDate();
  new Time('2020-02-25T16:03:13.87654321Z').toDate();
  new Time('2020-02-25T16:03:13.7654321Z').toDate();
  new Time('2020-02-25T16:03:13.654321Z').toDate();
  new Time('2020-02-25T16:03:13.54321Z').toDate();
  new Time('2020-02-25T16:03:13.4321Z').toDate();
  new Time('2020-02-25T16:03:13.321Z').toDate();
  new Time('2020-02-25T16:03:13.21Z').toDate();
  new Time('2020-02-25T16:03:13.1Z').toDate();
  new Time('2020-02-25T16:03:13Z').toDate();
});

test('create record with time field', () => {
  const t = createData(new Date(0)) as Time;
  expect(t.toDate()).toEqual(new Date(0));
});

test('keeps the milliseconds', () => {
  const date = new Time('2020-02-25T16:03:17.838527Z').toDate();
  expect(date?.toISOString()).toEqual('2020-02-25T16:03:17.838Z');
});

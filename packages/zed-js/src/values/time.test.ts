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
  const t = createData(new Date(0)) as unknown as Time;
  expect(t.toDate()).toEqual(new Date(0));
});

test('keeps the milliseconds', () => {
  const date = new Time('2020-02-25T16:03:17.838527Z').toDate();
  expect(date?.toISOString()).toEqual('2020-02-25T16:03:17.838Z');
});

test('format with strftime with default', () => {
  const time = new Time('2000-01-01T00:00:00Z');
  expect(time.format()).toBe('2000-01-01T00:00:00.000+00:00');
});

test('format in new york', () => {
  const time = new Time('2000-01-01T00:00:00Z');
  time.zone = 'America/New_York';
  expect(time.format()).toBe('1999-12-31T19:00:00.000-05:00');
});

test('format in los angeles', () => {
  const time = new Time('2000-01-01T00:00:00Z');
  Time.config.zone = 'America/Los_Angeles';
  expect(time.format()).toEqual('1999-12-31T16:00:00.000-08:00');
});

test('format using local specifier and static ime zone', () => {
  const time = new Time('2000-01-01T00:00:00Z');
  Time.config.zone = 'Asia/Bangkok';
  expect(time.format('%a, %B %d %Y at %H:%M, %z')).toEqual(
    'Sat, January 01 2000 at 07:00, +0700'
  );
});

test('format using static format', () => {
  const time = new Time('2000-01-01T00:00:00Z');
  Time.config.zone = 'America/New_York';
  Time.config.format = '%a, %B %d %Y at %H:%M, %z';
  expect(time.format()).toEqual('Fri, December 31 1999 at 19:00, -0500');
});

test('toString when nothing is set', () => {
  Time.config.zone = null;
  Time.config.format = null;
  const time = new Time('2000-01-01T00:00:00Z');
  expect(time.toString()).toBe(time.value);
});

test('toString when zone is set', () => {
  Time.config.zone = 'America/New_York';
  Time.config.format = null;
  const time = new Time('1999-12-31T19:00:00.000-05:00');
  expect(time.toString()).toBe(time.value);
});

test('toString when format is set', () => {
  Time.config.zone = null;
  Time.config.format = '%A';
  const time = new Time('1999-12-31T19:00:00.000-05:00');
  expect(time.toString()).toBe('Saturday');
});

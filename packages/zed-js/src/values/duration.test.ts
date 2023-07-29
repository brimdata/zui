import {
  Duration,
  Hour,
  Microsecond,
  Millisecond,
  Minute,
  Nanosecond,
  Second,
} from './duration';

const cases = [
  ['0s', 0n],
  ['5s', 5n * Second],
  ['30s', 30n * Second],
  ['1478s', 1478n * Second],
  // minus sign
  ['-5s', -5n * Second],
  ['-0s', 0n],
  ['+0s', 0n],
  // decimal
  ['5.0s', 5n * Second],
  ['5.6s', 5n * Second + 600n * Millisecond],
  ['5.s', 5n * Second],
  ['.5s', 500n * Millisecond],
  ['1.0s', 1n * Second],
  ['1.00s', 1n * Second],
  ['1.004s', 1n * Second + 4n * Millisecond],
  ['1.0040s', 1n * Second + 4n * Millisecond],
  ['100.00100s', 100n * Second + 1n * Millisecond],
  // different units
  ['10ns', 10n * Nanosecond],
  ['11us', 11n * Microsecond],
  ['13ms', 13n * Millisecond],
  ['14s', 14n * Second],
  ['15m', 15n * Minute],
  ['16h', 16n * Hour],
  // composite durations
  ['3h30m', 3n * Hour + 30n * Minute],
  ['10.5s4m', 4n * Minute + 10n * Second + 500n * Millisecond],
  ['-2m3.4s', -(2n * Minute + 3n * Second + 400n * Millisecond)],
  [
    '1h2m3s4ms5us6ns',
    1n * Hour +
      2n * Minute +
      3n * Second +
      4n * Millisecond +
      5n * Microsecond +
      6n * Nanosecond,
  ],
  [
    '39h9m14.425s',
    39n * Hour + 9n * Minute + 14n * Second + 425n * Millisecond,
  ],
  // large value
  ['52763797000ns', 52763797000n * Nanosecond],
  // more than 9 digits after decimal point, see https://golang.org/issue/6617
  ['0.3333333333333333333h', 20n * Minute],
  // 9007199254740993 = 1<<53+1 cannot be stored precisely in a float64
  ['9007199254740993ns', (1n << 53n) + 1n * Nanosecond],
  // largest duration that can be represented by int64 in nanoseconds
  ['9223372036854775807ns', (1n << 63n) - 1n * Nanosecond],
  ['9223372036854775.807us', (1n << 63n) - 1n * Nanosecond],
  ['9223372036s854ms775us807ns', (1n << 63n) - 1n * Nanosecond],
  // large negative value
  ['-9223372036854775807ns', (-1n << 63n) + 1n * Nanosecond],
  // huge string; issue 15011.
  ['0.100000000000000000000h', 6n * Minute],
  // This value tests the first overflow check in leadingFraction.
  [
    '0.830103483285477580700h',
    49n * Minute + 48n * Second + 372539827n * Nanosecond,
  ],
] as [string, bigint][];

describe('go test library', () => {
  for (const [input, expected] of cases) {
    test('input: ' + input, () => {
      expect(new Duration(input).asNanos()).toEqual(expected);
    });
  }
});

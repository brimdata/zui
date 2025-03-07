import { test, expect } from '@playwright/test';
import TestApp from '../helpers/test-app';
import { sprintf } from 'sprintf-js';
import { getPath } from '@brimdata/sample-data';

const testQueries = [
  {
    zed: 'count()',
    expectedStats: { results: 1, shapes: 1 },
  },
  {
    zed: 'count() by _path | sort _path',
    expectedStats: { results: 8, shapes: 1 },
  },
  {
    zed: '_path=="conn" | count()',
    expectedStats: { results: 1, shapes: 1 },
  },
  {
    zed: '_path=="conn" | cut ts, id.orig_h, id.orig_p, id.resp_h, id.resp_p, proto | sort ts',
    expectedStats: { results: 19, shapes: 1 },
  },
  {
    zed: '_path=="x509" or _path=="ssl" | sort _path',
    expectedStats: { results: 2, shapes: 2 },
  },
];

test.describe('Ingest tests', () => {
  const app = new TestApp('Ingest tests');

  test.beforeAll(async () => {
    await app.init();
    await app.createPool([getPath('sample.zeektsv')]);
    await app.click('button', 'Query Pool');
  });

  test.afterAll(async () => {
    await app.shutdown();
  });

  testQueries.forEach(({ zed, expectedStats }, i) => {
    const testId = sprintf('%03d', i);
    test(`query${testId}: "${zed}"`, async () => {
      await app.query(zed);
      const resultStats = await app.getViewerStats();
      expect(resultStats).toEqual(expectedStats);
    });
  });
});

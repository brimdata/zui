import { test } from '@playwright/test';
import TestApp from './helpers/test-app';

export function play(
  name: string,
  body: (app: TestApp, testFn: typeof test) => void
) {
  const app = new TestApp(name);
  test.describe(name, () => {
    test.beforeAll(async () => {
      await app.init();
    });

    test.afterAll(async () => {
      await app.shutdown();
    });
    body(app, test);
  });
}

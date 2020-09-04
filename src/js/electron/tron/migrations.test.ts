
import tron from "./";

test("run", async () => {
  let migrations = await tron.migrations(0);
  let state = { version: 0, data: undefined };

  let newState = migrations.run(state, migrations.getPending());

  expect(newState.version).toEqual(migrations.getLatestVersion());
});

test("sorts the migrations by version", async () => {
  let migrations = await tron.migrations(0);
  let versions = migrations.getAll().map(m => m.version);
  let sorted = versions.slice().sort((a, b) => a - b);

  expect(versions).toEqual(sorted);
});

test("run pending", async () => {
  let migrations = await tron.migrations(0);
  let state = { version: 0, data: undefined };

  let newState = migrations.runPending(state);

  expect(newState.version).toEqual(migrations.getLatestVersion());
});
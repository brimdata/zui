import { testApi, assertThrowsAsync } from "./helper/mod.ts";

testApi("creating a subspace", async (zealot) => {
  const parent = await zealot.spaces.create(
    { name: "space1", storage: { kind: "archivestore" } },
  );

  /* There is no way to ingest logs into an archive through a zqd server.
     The only way is using the zar command. Once that changes, update this
     test to first ingest into an archive, then create a subspace from one
     of the logs. For now, just assert that the correct error message is 
     returned. */
  await assertThrowsAsync(
    () =>
      zealot.subspaces.create(
        { name: "my subspace", logs: ["id1"], spaceId: parent.id },
      ),
    Error,
    "OpenArchive: no logs left after filter",
  );
});

import { assertEquals, testApi } from "./helper/mod.ts";

testApi("listing the space", async (zealot) => {
  await zealot.spaces.create({ name: "space1" });
  const spaces = await zealot.spaces.list();
  assertEquals(spaces.length, 1);
});

testApi("creating a space", async (zealot) => {
  const space = await zealot.spaces.create({ name: "space1" });

  assertEquals(space.name, "space1");
  assertEquals(space.storage_kind, "filestore");
});

testApi("creating an archive", async (zealot) => {
  const space = await zealot.spaces.create(
    {
      name: "archive1",
      data_path: "/Users/jkerr/work/zar_demo/logs",
      storage: { kind: "archivestore" },
    },
  );

  assertEquals(space.name, "archive1");
  assertEquals(space.storage_kind, "archivestore");
  assertEquals(space.data_path, "/Users/jkerr/work/zar_demo/logs");
});

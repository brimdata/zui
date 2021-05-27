module.exports = {
  globals: {
    "ts-jest": {
      babelConfig: true
    }
  },
  setupFilesAfterEnv: ["./setup-after-env.ts"]
  //   testURL: "http://localhost/search.html",
  //   roots: ["./zealot"],
  //   snapshotSerializers: ["enzyme-to-json/serializer"],
  //   globalSetup: "./src/js/test/globalSetup.ts",
  //   transformIgnorePatterns: ["node_modules"],
  //   moduleDirectories: ["node_modules", "<rootDir>"],
  //   testPathIgnorePatterns: ["/node_modules/", "/itest/", "/dist/"]
}

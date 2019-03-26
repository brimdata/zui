module.exports = {
  excludes: ["./dist/**", "**/**.test.js"],
  namedExports: {
    reselect: ["createSelector"],
    enzyme: ["mount", "shallow"],
    react: ["useState", "useRef", "useEffect"]
  }
}

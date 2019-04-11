module.exports = {
  excludes: ["./dist/**", "**/**.test.js"],
  namedExports: {
    reselect: ["createSelector"],
    enzyme: ["mount", "shallow"],
    react: ["useState", "useRef", "useEffect", "useLayoutEffect"],
    "react-dom": ["renderToString"],
    lodash: ["get", "isEqual", "isEmpty", "every"],
    "react-router-dom": ["Redirect"]
  }
}

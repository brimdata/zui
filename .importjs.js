module.exports = {
  excludes: ["./dist/**", "**/**.test.js"],
  namedExports: {
    electron: ["remote"],
    reselect: ["createSelector"],
    enzyme: ["mount", "shallow"],
    react: ["useState", "useRef", "useEffect", "useLayoutEffect"],
    "react-dom": ["renderToString"],
    lodash: ["throttle", "get", "isEqual", "isEmpty", "every", "kebabCase"],
    "react-router-dom": ["Redirect"],
    "react-redux": ["useDispatch"]
  }
}

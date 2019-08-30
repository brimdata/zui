module.exports = {
  excludes: ["./dist/**", "**/**.test.js"],
  namedExports: {
    electron: ["ipcMain", "ipcRenderer", "remote", "BrowserWindow"],
    reselect: ["createSelector"],
    enzyme: ["mount", "shallow"],
    react: ["useState", "useRef", "useEffect", "useLayoutEffect", "useMemo"],
    "react-dom": ["render"],
    lodash: ["throttle", "get", "isEqual", "isEmpty", "every", "kebabCase"],
    "react-router-dom": ["Redirect"],
    "react-redux": ["useDispatch"]
  }
}

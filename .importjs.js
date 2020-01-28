module.exports = {
  excludes: ["./dist/**", "**/**.test.js"],
  aliases: {
    anime: "animejs"
  },
  namedExports: {
    electron: ["ipcMain", "ipcRenderer", "remote", "BrowserWindow"],
    reselect: ["createSelector"],
    enzyme: ["mount", "shallow"],
    react: [
      "useState",
      "useRef",
      "useEffect",
      "useLayoutEffect",
      "useMemo",
      "useCallback"
    ],
    "react-dom": ["render"],
    lodash: [
      "throttle",
      "get",
      "has",
      "isEqual",
      "isEmpty",
      "every",
      "kebabCase"
    ],
    "react-spring": ["useTrail", "useSpring", "useSprings"],
    "react-router-dom": ["Redirect"],
    "react-redux": ["useDispatch"]
  }
}

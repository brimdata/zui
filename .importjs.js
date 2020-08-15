module.exports = {
  excludes: ["./dist/**", "**/**.test.js"],
  aliases: {
    anime: "animejs",
    styled: "styled-components",
    produce: "immer"
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
      "kebabCase",
      "camelCase"
    ],
    zealot: ["createZealot", "createZealotMock"],
    "react-spring": ["useTrail", "useSpring", "useSprings"],
    "react-router-dom": ["Redirect"],
    "react-redux": ["useDispatch"]
  }
}

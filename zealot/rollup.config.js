// rollup.config.js
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"

export default {
  input: "dist/cjs/index.js",
  output: {
    file: "dist/es/index.js",
    format: "es"
  },
  plugins: [resolve({preferBuiltins: false, browser: true}), commonjs()]
}

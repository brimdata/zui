import typescript from "@rollup/plugin-typescript"
import commonjs from "@rollup/plugin-commonjs"
import nodeResolve from "@rollup/plugin-node-resolve"

export default {
  input: "zealot/index.ts",
  output: [
    {
      file: "dist/zealot.es.js",
      format: "es",
      sourcemap: true
    }
  ],
  plugins: [
    typescript({module: "ES2020"}),
    nodeResolve(),
    commonjs({extensions: [".js", ".ts"]})
  ]
}

import typescript from "@rollup/plugin-typescript"
import commonjs from "@rollup/plugin-commonjs"

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
    commonjs({extensions: [".js", ".ts"]})
  ]
}

import typescript from "@rollup/plugin-typescript"

export default {
  input: "zealot/index.ts",
  output: [
    {
      file: "dist/zealot.es.js",
      format: "es",
      sourcemap: true
    }
  ],
  plugins: [typescript()]
}

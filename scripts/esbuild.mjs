import * as esbuild from "esbuild"
import {nodeExternalsPlugin} from "esbuild-node-externals"

const args = process.argv.slice(2)

const context = await esbuild.context({
  entryPoints: ["./src/js/electron/main.ts"],
  outfile: "dist/main.js",
  bundle: true,
  minify: false,
  platform: "node",
  sourcemap: true,
  target: "node14",
  plugins: [nodeExternalsPlugin()],
})

if (args.includes("--watch")) {
  await context.rebuild()
  await context.watch()
  console.log("watching for changes")
} else {
  await context.rebuild()
  await context.dispose()
}

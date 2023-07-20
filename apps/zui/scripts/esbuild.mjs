import * as esbuild from "esbuild"

const args = process.argv.slice(2)

const context = await esbuild.context({
  entryPoints: ["./src/electron/main.ts"],
  outdir: "dist",
  bundle: true,
  minify: false,
  platform: "node",
  sourcemap: true,
  target: "node16",
  external: ["keytar", "electron", "node-pipe"],
  tsconfig: "./tsconfig.json",
})

if (args.includes("--watch")) {
  await context.rebuild()
  await context.watch()
  console.log("watching for changes")
} else {
  await context.rebuild()
  await context.dispose()
}


const path = require('path');
require('./wasm_exec');

const go = new Go();
go.argv = process.argv.slice(2);
go.env = Object.assign({ TMPDIR: require('os').tmpdir() }, process.env);
go.exit = process.exit;

const wasmFile = path.join(__dirname, '../dist/main.wasm');
async function initZedWasm() {
  const buffer = global.fs.readFileSync(wasmFile);
  const result = await WebAssembly.instantiate(buffer, go.importObject);
  return go.run(result.instance);
}

module.exports = { initZedWasm };

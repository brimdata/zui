.PHONY: test bundle

test:
	deno test --allow-net --allow-run --allow-read --allow-write

bundle: cache-bust
	deno bundle mod.ts bundle.js
	../node_modules/.bin/babel --config-file "../.babelrc" bundle.js -o index.js

cache-bust:
	deno cache --reload mod.ts

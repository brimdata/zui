.PHONY: test bundle

test:
	deno test --allow-net --allow-run --allow-read --allow-write

bundle: cache-bust
	deno bundle mod.ts ../src/js/services/zealot.js

cache-bust:
	deno cache --reload mod.ts

import crypto from 'node:crypto';
import getRandomValues from 'polyfill-crypto.getrandomvalues';

globalThis.crypto = { ...crypto, getRandomValues };
globalThis.requestAnimationFrame = setTimeout;
globalThis.require = require;
globalThis.fs = require('fs');
globalThis.TextEncoder = require('util').TextEncoder;
globalThis.TextDecoder = require('util').TextDecoder;

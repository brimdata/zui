import crypto from 'node:crypto';
import getRandomValues from 'polyfill-crypto.getrandomvalues';

globalThis.crypto = { ...crypto, getRandomValues };
globalThis.requestAnimationFrame = setTimeout;

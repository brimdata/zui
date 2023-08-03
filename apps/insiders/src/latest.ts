import fetch from 'node-fetch';

const BUILD_SHA_FILE = 'build_sha.txt';

export async function getLatestInsidersSha(version: string) {
  const resp = await fetch(shaUrl(version));
  const sha = await resp.text();
  return sha.trim();
}

function shaUrl(tag: string) {
  return `https://github.com/brimdata/zui-insiders/releases/download/${tag}/${BUILD_SHA_FILE}`;
}

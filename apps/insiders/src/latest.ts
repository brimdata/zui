import { Octokit } from 'octokit';
import fetch from 'node-fetch';

const gh = new Octokit();

export async function getLatestInsidersVersion() {
  const release = await getRelease();
  // Remove the v
  return release.data.tag_name.slice(1);
}

export async function getLatestInsidersSha() {
  const release = await getRelease();
  const { tag_name } = release.data;
  const resp = await fetch(shaUrl(tag_name));
  const sha = await resp.text();
  return sha.trim();
}

function shaUrl(tag: string) {
  return `https://github.com/brimdata/zui-insiders/releases/download/${tag}/sha.txt`;
}

function getRelease() {
  return gh.rest.repos.getLatestRelease({
    owner: 'brimdata',
    repo: 'zui-insiders',
  });
}

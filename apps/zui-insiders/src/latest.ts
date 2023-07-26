import { Octokit } from 'octokit';

const gh = new Octokit();

export async function getLatestInsidersVersion() {
  const release = await gh.rest.repos.getLatestRelease({
    owner: 'brimdata',
    repo: 'zui-insiders',
  });

  return release.data.tag_name.slice(1); // Remove the v
}

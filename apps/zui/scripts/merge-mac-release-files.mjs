// Based on https://github.com/electron-userland/electron-builder/issues/5592#issuecomment-2004803764
import { Octokit } from "octokit";
import pkg from '../package.json' assert {type: 'json'};
import { TextDecoder } from 'node:util';
import fs from 'node:fs';
import { Readable } from 'node:stream';
import { Buffer } from 'node:buffer';
import yaml from 'js-yaml';

const token = process.env.GH_TOKEN

const client = new Octokit({
  auth: token
});

// These are derived from settings in package.json so the script will work on
// both regular Zui and Zui Insiders.
const OWNER = pkg.repository.split('/')[3];
const REPO = pkg.repository.split('/')[4];
const PRODUCT_NAME= pkg.productName.replaceAll(' ', '-');
const URL = `/repos/${OWNER}/${REPO}/releases`;
const VERSION = pkg.version;
const RELEASE_NAME = (PRODUCT_NAME == 'Zui') ? 'v' + VERSION : VERSION;
const FILE_NAME = 'latest-mac.yml';
const LOCAL_FILE_PATH = `dist/apps/zui/${FILE_NAME}`;

const mergeFiles = (intel, arm) => {
  const intelObject = yaml.load(intel);
  const armObject = yaml.load(arm);

  const mergedObject = {
    ...intelObject,
    files: [...intelObject.files, ...armObject.files]
  };

  const dumpOptions = {
    // avoids moving the sha512 checksum into its own line
    lineWidth: -1,
  };

  const mergedString = yaml.dump(mergedObject, dumpOptions);
  return mergedString;
}

const getPlatformFromLatestMacYml = (content) => {
  const intelRe = `${PRODUCT_NAME}-${VERSION}-x86.dmg`
  const armRe = `${PRODUCT_NAME}-${VERSION}-arm64.dmg`
  const isIntel = content.includes(intelRe);
  const isArm = content.includes(armRe);

  if (isIntel && isArm) return 'both';
  if (isIntel && !isArm) return 'intel';
  if (!isIntel && isArm) return 'arm';

  return 'none';
}

(async () => {
  const allReleases = await client.request(`GET ${URL}`);
  const currentRelease = allReleases.data.find(release => {
    return release.name === RELEASE_NAME;
  })

  if (!currentRelease) {
    console.log('No release found. Skipping merge')
    return;
  }
  console.log('Release found')

  if (!fs.existsSync(LOCAL_FILE_PATH)) {
    console.log(`[local] could not find ${FILE_NAME}. Skipping merge`);
    return;
  }
  console.log(`[local] ${FILE_NAME} found`);

  const localLatestMacYmlContent = fs.readFileSync(LOCAL_FILE_PATH, { encoding: 'utf8' });

  const localPlatform = getPlatformFromLatestMacYml(localLatestMacYmlContent);

  if (localPlatform === 'none' || localPlatform === 'both') {
    console.log(`[local] ${FILE_NAME} invalid. Platform: ${localPlatform}. Skipping merge`)
    return;
  }
  console.log(`[local] ${FILE_NAME} valid: Platform: ${localPlatform}`)

  const localPlatformPresentRemotely = currentRelease.assets.find(asset => {
    return asset.name === `latest-mac-${localPlatform}.yml`;
  });

  if (localPlatformPresentRemotely) {
    try {
      await client.request(`DELETE ${URL}/assets/${localPlatformPresentRemotely.id}`);
      console.log(`[remote] deleted latest-mac-${localPlatform}.yml`)
    } catch(e) {
      console.log(`[remote] error deleting latest-mac-${localPlatform}.yml. Skipping merge`)
      console.log(e);
      return;
    }
  }

  const uploadUrl = currentRelease.upload_url;
  try {
    await client.rest.repos.uploadReleaseAsset({
      url: uploadUrl,
      headers: {
        'content-type': 'application/octet-stream',
        'content-length': Buffer.byteLength(localLatestMacYmlContent),
      },
      name: `latest-mac-${localPlatform}.yml`,
      data: Readable.from(localLatestMacYmlContent),
    })
    console.log(`[remote] latest-mac-${localPlatform}.yml uploaded`)
  } catch(e) {
    console.log(`[remote] error uploading latest-mac-${localPlatform}.yml. Skipping merge`);
    console.log(e);
    return;
  }

  const remotePlatform = localPlatform === 'intel' ? 'arm' : 'intel';

  const remotePlatformFileExists = currentRelease.assets.find(asset => asset.name === `latest-mac-${remotePlatform}.yml`)

  if (!remotePlatformFileExists) {
    console.log(`[remote] latest-mac-${remotePlatform}.yml does not exist. Skipping merge`)
    return;
  } else {
    console.log(`[remote] latest-mac-${remotePlatform}.yml found`)
  }

  let remotePlatformFile;

  try {
    remotePlatformFile = await client.request(`GET ${URL}/assets/${remotePlatformFileExists.id}`, {
      headers: {
        accept: 'application/octet-stream'
      }
    });
    console.log(`[remote] latest-mac-${remotePlatform}.yml downloaded`)
  } catch(e) {
    console.log(`[remote] error downloading latest-mac-${remotePlatform}.yml. Skipping merge`);
    console.log(e);
    return;
  }

  const remoteLatestMacYmlContent = new TextDecoder().decode(remotePlatformFile.data);

  try {
    const originalAsset = currentRelease.assets.find(asset => {
      return asset.name === FILE_NAME;
    })

    if (!originalAsset) {
      console.log(`[remote] ${FILE_NAME} not found. Skipping merge`);
      return;
    } else {
      console.log(`[remote] ${FILE_NAME} found`)
    }

    await client.request(`DELETE ${URL}/assets/${originalAsset.id}`);
    console.log(`[remote] deleted ${FILE_NAME}`)
  } catch(e) {
    console.log(`[remote] error deleting ${FILE_NAME}. Skipping merge`)
    console.log(e);
    return
  }

  const mergedContent = remotePlatform === 'intel' ? mergeFiles(remoteLatestMacYmlContent, localLatestMacYmlContent) : mergeFiles(localLatestMacYmlContent, remoteLatestMacYmlContent);

  const assetStream = new Readable();
  assetStream.push(mergedContent);
  assetStream.push(null);

  try {
    await client.rest.repos.uploadReleaseAsset({
      url: uploadUrl,
      headers: {
        'content-type': 'application/octet-stream',
        'content-length': Buffer.byteLength(mergedContent),
      },
      name: FILE_NAME,
      data: assetStream,
    })
    console.log(`[remote] uploaded merged ${FILE_NAME}`)
  } catch(e) {
    console.log(`[remote] error uploading merged ${FILE_NAME}. Skipping merge`)
    console.log(e);
    return;
  }

  // cleanup
  const updatedRelease = await client.request(`GET ${URL}`);
  const updatedCurrentRelease = updatedRelease.data.find(release => {
    return release.name === RELEASE_NAME;
  })

  const assetsToClean = updatedCurrentRelease.assets.filter(asset => {
    return asset.name === `latest-mac-arm.yml` || asset.name === `latest-mac-intel.yml`;
  })

  for (const assetToClean of assetsToClean) {
    try {
      await client.request(`DELETE ${URL}/assets/${assetToClean.id}`);
      console.log(`[remote:cleanup] deleted ${assetToClean.name}`)
    } catch(e) {
      console.log(`[remote:cleanup] error deleting ${assetToClean.name}`);
      console.log(e);
    }
  }

  console.log('Merge complete')
})()

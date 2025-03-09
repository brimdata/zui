import { remove, mkdirp } from 'fs-extra';
import { itestDir } from '../helpers/env';

export default async function setup() {
  process.env.BRIM_ITEST = 'true';
  await remove(itestDir());
  await mkdirp(itestDir());
}

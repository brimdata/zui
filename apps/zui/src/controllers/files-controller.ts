import matter from "gray-matter"
import pathmod from "node:path"
import fs from "node:fs"
import {BulletController} from "src/modules/bullet/main"
import {FSEntry} from "src/models/fs-entry"

export class FilesController extends BulletController {
  index(params: {path: string}) {
    return fs
      .readdirSync(params.path)
      .map((name) => new FSEntry(pathmod.join(params.path, name)).attrs)
  }

  show(params: {path: string}) {
    return matter(fs.readFileSync(params.path, {encoding: "utf-8"}))
  }
}

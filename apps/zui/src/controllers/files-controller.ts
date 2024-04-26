import {BulletController} from "src/modules/bullet/main"

export class FilesController extends BulletController {
  index(params) {
    return "hello, " + params.id
  }
}

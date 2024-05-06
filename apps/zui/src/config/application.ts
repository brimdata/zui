import {BulletApplication} from "src/modules/bullet/main"
import * as controllers from "../controllers"

BulletApplication.config((app) => {
  app.controllers = controllers
})

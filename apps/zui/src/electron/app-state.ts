import {AppStateBackup} from "./app-state-backup"
import {AppStateFile} from "./app-state-file"
import {Migrations} from "./migrations"

/**
 * The application state is saved in a json file called appState.json
 * It contains a single object.
 * {
 *   version: number,
 *   data: object
 * }
 *
 * In the code below, references to "state" mean the root object.
 * References to version and data mean the keys inside the root object.
 */

export class AppState {
  file: AppStateFile

  constructor(args: {path: string | null; backupDir: string}) {
    const file = new AppStateFile(args.path)
    if (file.isEmpty) file.create(Migrations.latestVersion)
    const migrations = Migrations.init({from: file.version})
    const backup = new AppStateBackup(args.backupDir)

    if (migrations.arePending) {
      backup.save(file)
      file.write(migrations.runPending(file.state))
    }
    this.file = file
  }

  get data() {
    return this.file.data
  }

  reset() {
    this.file.destroy()
    this.file.create(Migrations.latestVersion)
  }

  save(data) {
    this.file.update(data)
  }
}

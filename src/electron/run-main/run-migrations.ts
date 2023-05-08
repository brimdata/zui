import migrateBrimToZui from "../migrations/2023-01-01-brim-to-zui"
import migrateBrimcapDirs from "../migrations/2023-05-05-brimcap-dirs"

export async function runMigrations() {
  await migrateBrimToZui()
  migrateBrimcapDirs()
}

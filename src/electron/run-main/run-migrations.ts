import migrateBrimToZui from "../migrations/2022-01-01-brim-to-zui"
import migrateBrimcapRoot from "../migrations/2022-05-05-brimcap-root"

export async function runMigrations() {
  await migrateBrimToZui()
  migrateBrimcapRoot()
}

import migrateBrimToZui from "../migrations/2023-01-01-brim-to-zui"
import migrateBrimcapRoot from "../migrations/2023-05-05-brimcap-root"
import migrateSuricataData from "../migrations/2023-05-05-suricata-data"

export async function runMigrations() {
  await migrateBrimToZui()
  migrateBrimcapRoot()
  migrateSuricataData()
}

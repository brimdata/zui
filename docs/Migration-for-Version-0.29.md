# Pool Migration for Version 0.29

1. Install the latest version of Brim.
2. Download the [migration script](https://raw.githubusercontent.com/brimdata/brim/main/scripts/util/migration-v0.29.sh).
3. Run it. `sh migration-v0.29`
4. Open the app and see your pools.

The migration script can be executed while Brim v0.29 is already open. Click **View > Reload** from the Brim pull-down menu to see your migrated pools after the script completes.
> **Windows Users**: See the section below titled "[How do I run this on Windows?](/#how-do-i-run-this-on-windows)".

## Will it delete anything?

No.

## Do I absolutely need to migrate?

No. Only run the steps above if you care to keep your old pool data. If you prefer a fresh start, you can delete your old pools by following the steps [below](#how-do-i-delete-the-old-pools).

## What does the script do?

The Zed lake service that powers Brim made breaking changes to its data storage format in this release. Your pools are currently stored in a `data/lake/` subdirectory under the Brim [user data](https://github.com/brimdata/brim/wiki/Filesystem-Paths#user-data) path. The new version expects the pools to be in a `lake/` subdirectory (i.e., one level higher) under the user data path. The script will read in the old data and write it to the new location. The script does not attempt to delete anything on your system. If you want to delete the old pools after this script finishes, see [below](#how-do-i-delete-the-old-pools).

## How do I delete the old pools?

You can remove the old pools by deleting the directory shown in the table below for your OS.

|**OS Platform**|**Location**                                          |
|---------------|------------------------------------------------------|
| **Windows**   | `%APPDATA%\Brim\data\lake`                           |
| **macOS**     | `$HOME/Library/Application Support/Brim/data/lake`   |
| **Linux**     | `$HOME/.config/Brim/data/lake`                       |

## How do I run this on Windows?

The script must be run in a Windows `sh` variant like `BusyBox`, `Cygwin`, or `MSYS2`. If you do not have any of these already setup, we recommend downloading [busybox.exe](https://frippery.org/files/busybox/busybox.exe) as it seems to be the easiest. Once downloaded, start the shell. See the [Busy Box documentation](https://frippery.org/busybox/) for more detail.

```
C:\path\to\busybox.exe sh -l
```

This will drop you into a `sh` environment where you can execute [step 3](#pool-migration-for-version-029).

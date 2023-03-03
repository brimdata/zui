---
sidebar_position: 4
---

# Brim/Zui Transition

Due to the large number of changes, the move from Brim v0.31.0 to Zui v1.0.0
requires some manual steps to fully upgrade.

Normally when the app is updated, the older version of the app is replaced
with the new version. But for this specific transition both the
[application binaries](https://zui.brimdata.io/docs/support/Filesystem-Paths#application-binaries)
and [user data](https://zui.brimdata.io/docs/support/Filesystem-Paths#user-data)
for the older Brim are left in place separate from the new Zui. With this in
mind, the sections below provide guidance on how to proceed from this state to
complete the transition.

## Zed Lake Migration

When Zui v1.0.0 first launches, the **Pools** list will be empty, but the data
in your pools from when you were running Brim v0.31.0 are still present in
the Brim [user data](https://zui.brimdata.io/docs/support/Filesystem-Paths#user-data)
directory. If you don't need your old pools anymore, you can leave the old
Brim user data where it is or backup/delete it as you choose. Zui will
not access it. However, if you want to migrate your pools to Zui, tools are
available in the [Zed Lake Migration](https://github.com/brimdata/zed-lake-migration)
repository. See its [README](https://github.com/brimdata/zed-lake-migration/blob/main/README.md)
for details.

## Platform-Specific Guidance

When Zui v1.0.0 is released, you will receive a notification of its
availability in Brim v0.31.0 as usual, but you'll need to complete some
additional manual steps at this point. See the section below for details
regarding the transition on your operating system.

Those interested in the technical details of the testing that led to this
guidance can read more
[here](https://github.com/brimdata/brim/issues/2459#issuecomment-1442316859).

### Windows

When presented with the update notice and **Restart** is clicked, Brim will
close and Zui installation will proceed. Once Zui is installed, _both_ the Brim
and Zui apps will be present in the installed **Programs** list. It is now
recommended to complete the [Zed lake migration](#zed-lake-migration) if you wish
and then manually uninstall Brim. From this point forward each new release
of Zui can be installed via auto-update and will replace any prior Zui entry
in the **Programs** list.

### macOS

When presented with the update notice and **Restart** is clicked, the app will
not actually restart. Instead, manually quit the app and
download/[install](https://zui.brimdata.io/docs/Installation#macos-installation)
the Zui v1.0.0 package for macOS. Once Zui is installed, _both_ the Brim and
Zui apps will be present in the installed **Applications** list. It is now
recommended to complete the [Zed lake migration](#zed-lake-migration) if you wish
and then manually uninstall Brim. From this point forward each new release
of Zui can be installed via auto-update and will replace any prior Zui entry
in the **Applications** list.

### Linux

Zui is similar to Brim in that only manual upgrades are possible on Linux. After
you manually install Zui v1.0.0, _both_ the Brim and Zui apps will be present
in the list of installed applications. It is now recommended to complete the
[Zed lake migration](#zed-lake-migration) if you wish and then manually
uninstall Brim.

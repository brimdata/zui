---
sidebar_position: 4
---

# Brim/Zui Transition

Moving from the Brim v0.31.0 desktop app to Zui v1.0.0 is expected to be a
smooth transition due to auto-upgrade on supported platforms and features
that migrate user data. However, some remnants are left behind after the
transition that justify manual cleanup. The sections below describe
platform-specific details for what to expect during/after the transition.
Those interested in the technical details of the testing that led to this
guidance can read more
[here](https://github.com/brimdata/brim/issues/2459#issuecomment-1276570759).

## Windows

Whether Zui v1.0.0 is installed via auto-upgrade or manually, testing indicates
that post-upgrade the Brim 0.31.0 entry should disappear from the installed
**Programs** list and a Zui 1.0.0 entry will appear instead. Your
[user data](https://zui.brimdata.io/docs/support/Filesystem-Paths#user-data)
(e.g., Zed lake data and other in-app configuration) will be migrated to a new
`%APPDATA%\Zui` folder. Your pre-migration user data will be left behind in
the `%APPDATA%\Brim` folder and will not be accessed by the Zui app. Feel free
to back it up or delete it once you're satisfied that your data is intact
in the new Zui app.

## macOS

If you allow Brim v0.31.0 to auto-upgrade to Zui v1.0.0, testing indicates that
post-upgrade the Brim entry should disappear from the installed
**Applications** list and a Zui entry will appear instead. However, if you
manually installed Zui v1.0.0, the Brim entry will _not_ automatically
disappear from the **Applications** list and therefore Brim should be
manually uninstalled.

Regardless of whether Zui v1.0.0 is installed manually or via auto-upgrade,
your [user data](https://zui.brimdata.io/docs/support/Filesystem-Paths#user-data)
(e.g., Zed lake data and other in-app configuration) will be migrated to a new
`$HOME/Library/Application Support/Zui` directory. Your pre-migration user data will be left behind in the `$HOME/Library/Application Support/Brim` directory
and will not be accessed by the Zui app. Feel free to back it up or delete it
once you're satisfied that your data is intact in the new Zui app.

## Linux

As has always been the case with Brim, only manual upgrade is possible on
Linux. When you manually install Zui v1.0.0, the Brim entry will _not_
automatically disappear from the list of installed applications and therefore
Brim should be manually uninstalled. Your
[user data](https://zui.brimdata.io/docs/support/Filesystem-Paths#user-data)
(e.g., Zed lake data and other in-app configuration) will be migrated to a new
`$HOME/.config/Zui` directory. Your pre-migration user data will be left behind
in the `$HOME/.config/Brim` directory and will not be accessed by the Zui app.
Feel free to back it up or delete it once you're satisfied that your data is
intact in the new Zui app.

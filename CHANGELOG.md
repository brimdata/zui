## v0.18.0
* Update zq to [v0.22.0](https://github.com/brimsec/zq/releases/tag/v0.22.0)
* Update Zeek to [v3.2.0-dev-brim10](https://github.com/brimsec/zeek/releases/tag/v3.2.0-dev-brim10) to take advantage of latest [geolocation](https://github.com/brimsec/brim/wiki/Geolocation) data (#1096)
* Move the code base from Flow to TypeScript (#1075)
* Point to new Slack community URL https://www.brimsecurity.com/join-slack/ (#1089)
* Show a spinner if there's delays closing the "new connection" modal (#1084)
* Add a right-click option to delete all Spaces (#1078)
* Organize History entries by unique Space/Connection combination (#1078)
* Fix an issue where closing Brim after having searched a remote Space caused a "Space does not exist" error when Brim was relaunched (#1091)

## v0.17.0
* Update zq to [v0.21.0](https://github.com/brimsec/zq/releases/tag/v0.21.0)
* Update Zeek to [v3.2.0-dev-brim9](https://github.com/brimsec/zeek/releases/tag/v3.2.0-dev-brim9) to take advantage of latest [geolocation](https://github.com/brimsec/brim/wiki/Geolocation) data (#1071)
* Fix an issue where abruptly killing Brim on Linux or macOS would leave behind an orphaned `zqd` process (#1031)
* Add an option for executing index searches on Archive Spaces (#1024)
* Fix an issue where right-clicking to delete a Space when the Brim window was not in focus caused an "Uncaught TypeError" (#1066)
* Enable import of nanosecond pcap files (#1069)

## v0.16.0
* Update zq to [v0.20.0](https://github.com/brimsec/zq/releases/tag/v0.20.0)
* Update Zeek to [v3.2.0-dev-brim8](https://github.com/brimsec/zeek/releases/tag/v3.2.0-dev-brim8) to take advantage of latest [geolocation](https://github.com/brimsec/brim/wiki/Geolocation) data (#1033)
* Fix an issue where the Back button brought the user to the wrong place (#1011)
* Fix an issue where opening/closing a Log Detail window during pcap import canceled the import (#1015)
* Sort field names in the column chooser alphabetically (#1012)
* Add a search tool in the column chooser to find field names (#1012)
* Fix an issue where clicking a link to [ZQL docs](https://github.com/brimsec/zq/tree/master/zql/docs) opened an unusable window (#1030)
* Expand the [wiki docs](https://github.com/brimsec/brim/wiki/Troubleshooting#ive-clicked-to-open-a-packet-capture-in-brim-but-it-failed-to-open) for troubleshooting pcap extraction issues (#1020)
* Fix an issue where the Packets button was not activating after scrolling down in the main events view (#1027)
* Add the ability to connect Brim to a remote [`zqd`](https://github.com/brimsec/zq/tree/master/cmd/zqd) (#1007)

## v0.15.1
* Update zq to [v0.19.1](https://github.com/brimsec/zq/releases/tag/v0.19.1) (fixes an issue with excess characters in Space names after upgrade)
* Fix an issue where opening Log Detail as the first action in a freshly-launched Brim threw an error (#1006)

## v0.15.0
* Update zq to [v0.19.0](https://github.com/brimsec/zq/releases/tag/v0.19.0)
* Update Zeek to [v3.2.0-dev-brim7](https://github.com/brimsec/zeek/releases/tag/v3.2.0-dev-brim7) to take advantage of latest [geolocation](https://github.com/brimsec/brim/wiki/Geolocation) data (#999)
* Use blue background color for clicked rows in main event view (#971)
* Fix an issue with brief white flashes during import auto-refresh (#972, #995)
* Fix an issue where double-clicking across two different rows acted like the second row had been double-clicked (#973)
* Adjust the amount of space consumed by the import progress bar (#980)
* Improve automatic Space naming during import (#984)
   * The `.brim` suffix is no longer added
   * If the presumed Space name already exists, a numeric suffix is added instead of rejecting the import due to the colliding Space name
* Add [wiki docs](https://github.com/brimsec/brim/wiki/Zeek-Customization#creating-your-customized-zeek) for how to create a customized Zeek from Brim Zeek artifacts (#978)
* Fix an issue where right-click operations on field values containing backslashes produced invalid ZQL (#993, #996)
* Make links on the Import page tabbable (#997)

## v0.14.0
* Update zq to [v0.18.0](https://github.com/brimsec/zq/releases/tag/v0.18.0)
* Add [geolocation](https://github.com/brimsec/brim/wiki/Geolocation) data to Zeek `conn` logs generated from imported pcaps (#959, #957, #935)
* Add developer documentation for [adding internal state migrations](https://github.com/brimsec/brim/wiki/Adding-Migrations) (#921)
* Restore the scroll position when going back to prior search results (#929)
* Add the [Zealot Client](https://github.com/brimsec/brim/blob/master/zealot/README.md) for communicating with [`zqd`](https://github.com/brimsec/zq/tree/master/cmd/zqd) via the REST API (#934)
* Add support documentation explaining where Brim stores debug logs (#939, #943)
* Fix an issue where records nested more than one level deep were not working correctly in Brim (#937)
* Improve the Column Chooser (#925, #953)
* Fix an issue where deleting a History entry incorrectly triggered its execution (#951)
* Expose React/Redux DevTools when in developer mode (#956)

## v0.13.1
* Ensure left panel is open by default, even on upgrades (#918)

## v0.13.0
* Update zq to [v0.17.0](https://github.com/brimsec/zq/releases/tag/v0.17.0)
* Add a "View in context" right-click option to zoom out to unfiltered data (#894)
* Rework left panel to include Space selection (#903, #857, #909, #913)
* "New version" notification on Linux now points to the Brim website download page (#914)

## v0.12.0
* Update zq to [v0.16.0](https://github.com/brimsec/zq/releases/tag/v0.16.0)

## v0.11.0
* Update zq to [v0.15.0](https://github.com/brimsec/zq/releases/tag/v0.15.0), which fixes [an issue with ZNG export](https://github.com/brimsec/brim/issues/814#issuecomment-636130351)
* Update Zeek to [v3.2.0-dev-brim3](https://github.com/brimsec/zeek/releases/tag/v3.2.0-dev-brim3), which adds [JA3](https://github.com/salesforce/ja3) and [HASSH](https://github.com/salesforce/hassh) support for pcaps imported into Brim (#861)
* Provide notification on Linux when a new Brim version is available for download (#870)

## v0.10.0
* Update zq to [v0.14.0](https://github.com/brimsec/zq/releases/tag/v0.14.0)
* Update Zeek to [v3.2.0-dev-brim2](https://github.com/brimsec/zeek/releases/tag/v3.2.0-dev-brim2), with the following platform specific changes:
   * Windows: importing pcaps is much faster than previous releases
   * macOS: importing pcaps no longer works on macOS versions prior to 10.14. (#819)
   * Linux: support importing pcapng formatted captures
* Allow processing of pcaps with a custom Zeek version (#771, #732, #807, #783, [wiki](https://github.com/brimsec/brim/wiki/Zeek-Customization))
* Format timestamps as IS08601 by default, and add a **Preferences** option to change format (#766)
* Fix an issue where spaces were not deleted when quitting during pcap import (#780)
* Migrate app state (such as Search History) upon upgrading rather than clearing it, starting with upgrades from [v0.9.1](https://github.com/brimsec/brim/releases/tag/v0.9.1) (#787, #793, #782, #821, #823)
* Add a **Preferences** option to change the Data Directory location (#794)
* Allow exporting of search results to a ZNG file (#802, #827)
* Fix an issue where clicking the **Choose** buttons in the **Preferences** menu would hang the app (#816)
* Add the ability to rename a Space via right-click (#806, #831)
* Fix an issue where a JSON typing configuration could not be selected in **Preferences** (#818)
* Fix an issue where old error messages were left behind after exiting **Preferences** (#829)

## v0.9.1

* **NOTE**: Prior state such as Search History will be lost on upgrade to this version
* Update zq to [v0.13.1](https://github.com/brimsec/zq/releases/tag/v0.13.1) (#756)

## v0.9.0

* **NOTE**: Prior state such as Search History will be lost on upgrade to this version
* Update zq to [v0.13.0](https://github.com/brimsec/zq/releases/tag/v0.13.0) (#750)
* Start the [Brim wiki](https://github.com/brimsec/brim/wiki) for documentation (#660)
* Import of Zeek logs in TSV, JSON, and ZNG formats (see the [wiki](https://github.com/brimsec/brim/wiki/Zeek-JSON-Import) for info on JSON). (#594, #720, #727, #625, #581, #643, #672, #716, #700, #717, #719, #735, #721, #729, #713)
* Support for Brim on Linux: `.deb` (#631) and `.rpm` (#636) installer packages
* Fix an issue where holding down arrow keys could freeze Brim (#670, #692)
* Allow Log Details to be popped out to a separate window by double-clicking an event or via a control at the top of Log Details panel (#651)
* Fix an issue where ZQL queries with double quotes were not escaped in right-click operations (#682)
* Fix an issue where Brim would crash when revisiting a tab for a deleted Space where a pcap had been opened (#681)
* The main search pane now auto-refreshes during pcap import to show additional Zeek logs as they're created (#713)
* Fix an issue where the Wireshark button was not active when re-opening a deleted Space (#722)
* Fix an issue where filenames containing the `#` character could not be opened in Brim (#723)
* Wrap long error messages (#728)
* Data stored by Brim is now centralized in a per-platform user data directory (#714)
* Fix an issue where Brim on Windows became unusable if every window except for "About" was closed (#737)
* Auto-update added on Windows, which will start to occur with the _next_ release after `v0.9.0` (#744)

## v0.8.0
* Update zq to [v0.11.1](https://github.com/brimsec/zq/releases/tag/v0.11.1) (fixes an issue that was causing the histogram to draw incorrectly) (#640)

## v0.7.0

* Introduce versioning of app state (**NOTE**: prior state such as Search History will be lost on upgrade to this version) (#587)
* Update zq to v0.10.0 (#605)
* Fix an issue where the first refresh during pcap load sometimes showed no events (#611)
* Fix an issue where sometimes windows were unable to be closed (#604)
* Up/down arrow keys now affect event highlighting & Log Details contents (#550)
* Use Wireshark icon in toolbar and Log Details view to open pcaps (#562)
* Enable the pcap button for any Zeek event that can be linked to a `conn` event (#562)
* Fix the "About" box link so it will open on Windows (#583)

## v0.6.0

* Update zq to v0.9.0 (#551)
* Add auto-update for MacOS (#515)
* Fix error message presentation via content-type inspection (#519)
* Add menu options for **Help > About** and **File > Settings** in Windows (#521)
* Add menu options for **File > Close Tab**, **File > Close Window**, and **File > Exit** (Windows only) (#522)
* Remove dependency on unzip executable (#525)
* Fix an issue where slices from pcap filenames containing space chars would not open (#526)
* Store pcap slices in OS temp dir rather than `Downloads` dir (#528)
* Fix an issue when clicking between multiple tabs during pcap ingest (#527)
* Maintain separate Log Details panel for each Space (#541)
* Show a warning in History panel for items from deleted Spaces (#547)
* Sign the Windows installer (#549)
* Change logging config to use the new waterfall logger in zqd (#540)
* Use a new Zeek launcher on Windows to improve error handling (#548)

## v0.5.4

* Ensure bundled zeek can run on MacOS version 10.10 and beyond. (#513)
* Update zq to v0.8.0. (#516)
* Fix an issue where a pcap slice error was not being caught. (#514)

## v0.5.3

* Update the windows zeek artifact to support pcapng. (#530)

## v0.5.2

This is the same as v0.5.1, but addresses a CI issue that stopped the creation of the Windows installer executable. 

## v0.5.1

* Initial (beta) Windows release creation and support. Windows releases are currently unsigned (unlike our Mac releases). See [Microsoft Windows beta limitations](https://github.com/brimsec/brim/wiki/Microsoft-Windows-beta-limitations) for details.
* Warn on close if there are still active pcap ingests.
* Fix some issues saving search history.

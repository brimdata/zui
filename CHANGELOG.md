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

* Initial (beta) Windows release creation and support. Windows releases are currently unsigned (unlike our Mac releases). See [Microsoft Windows beta limitations](wiki/Microsoft-Windows-beta-limitations) for details.
* Warn on close if there are still active pcap ingests.
* Fix some issues saving search history.

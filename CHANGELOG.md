## v0.5.4

* Ensure bundled zeek can run on MacOS version 10.10 and beyond. (#513)
* Update zq to v0.8.0. (#516)
* Fix an issue where a pcap slice failed and the downloading notification never dismissed. (#514)

## v0.5.3

* Update the windows zeek artifact to support pcapng. (#530)

## v0.5.2

This is the same as v0.5.1, but addresses a CI issue that stopped the creation of the Windows installer executable. 

## v0.5.1

* Initial (beta) Windows release creation and support. Windows releases are currently unsigned (unlike our Mac releases). See [README-Windows](README-Windows.md) for details.
* Warn on close if there are still active pcap ingests.
* Fix some issues saving search history.

## v0.5.2

This is the same as v0.5.1, but addresses a CI issue that stopped the creation of the Windows installer executable. 

#### Windows Limitations (beta notice)

Brim on Windows can currently be considered beta quality. There's two
significant known limitations:

* On Windows, generation of Zeek logs from pcaps is slower than we'd like it to be. This is due to lack of formal support for Zeek on Windows. We got it working with [our own Zeek port](https://github.com/brimsec/zeek/tree/master/brim/windows), but the best we could do in our first take uses 32-bit [Cygwin](https://www.cygwin.com/). We'll be working to improve this over time.
* We don't yet have the necessary Windows certifications in place to provide a warning-free install experience. Your anti-virus software is likely to jump in with "Are you sure you want to run this?" warnings and scans for viruses. Rest assured that we've not put viruses in our code, but we understand if you're concerned about installing under such conditions. You may want to install on a scratch Windows VM if that feels safer, or you can wait until we've secured the certifications in an upcoming release.

## v0.5.1

* Initial Windows release creation and support. Windows releases are currently unsigned (unlike our Mac releases), but will be soon.
* Warn on close if there are still active pcap ingests.
* Fix some issues saving search history.

#### Windows Limitations (beta notice)

Brim on Windows can currently be considered beta quality. There's two
significant known limitations:

* On Windows, generation of Zeek logs from pcaps is slower than we'd like it to be. This is due to lack of formal support for Zeek on Windows. We got it working with [our own Zeek port](https://github.com/brimsec/zeek/tree/master/brim/windows), but the best we could do in our first take uses 32-bit [Cygwin](https://www.cygwin.com/). We'll be working to improve this over time.
* We don't yet have the necessary Windows certifications in place to provide a warning-free install experience. Your anti-virus software is likely to jump in with "Are you sure you want to run this?" warnings and scans for viruses. Rest assured that we've not put viruses in our code, but we understand if you're concerned about installing under such conditions. You may want to install on a scratch Windows VM if that feels safer, or you can wait until we've secured the certifications in an upcoming release.


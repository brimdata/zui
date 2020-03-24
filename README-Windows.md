# Windows Limitations (beta notice)

Brim support on Windows is currently at beta quality. There's two
significant known limitations:

1. Generation of Zeek logs from pcaps is slower than we'd like it to be. This
is related to the lack of formal support for Zeek on Windows. We got it
working with [our own Zeek port](https://github.com/brimsec/zeek/tree/master/brim/windows),
but the best we could do in our first attempt uses 32-bit
[Cygwin](https://www.cygwin.com/). We'll be working to improve this over time.
2. We don't yet have the necessary Windows certifications in place to "sign"
the release (like we do for macOS) and hence provide a warning-free
install experience. Your anti-virus software is likely to jump in with "Are
you sure you want to run this?" warnings and scans for viruses. Rest assured
that we've not put viruses in our code, but we understand if you're concerned
about installing under such conditions. You may want to install on a scratch
Windows VM if that feels safer, or watch the repo to be notified when we've
secured the certifications in an upcoming release.

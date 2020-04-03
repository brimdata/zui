# Windows Limitations (beta notice)

Brim support on Windows is currently at beta quality. There's two
significant known limitations:

1. Generation of Zeek logs from pcaps is slower than we'd like it to be. This
is related to the lack of formal support for Zeek on Windows. We got it
working with [our own Zeek port](https://github.com/brimsec/zeek/tree/master/brim/windows),
but the best we could do in our first attempt uses 32-bit
[Cygwin](https://www.cygwin.com/). We'll be working to improve this over time.

2. We sign the Windows installer we create with every new Brim release;
however, you may still see a Microsoft Defender SmartScreen popup when you run
the installer. This is because Brim, and the signing certificate we use, are
both new, and Defender considers number of application installs and certificate
uses when determining whether or not to display the SmartScreen popup. Once we
have enough Brim Windows installations, Defender should stop doing this.  We do
recommend that you click on the "More Info" link in the SmartScreen popup and
verify that the installer is signed by `Brim Security, Inc.`.

We recommend this blog post if you'd like more info on Windows code signing:
https://www.digicert.com/blog/ms-smartscreen-application-reputation/

# Windows Limitations (beta notice)

Brim support on Windows is currently at beta quality. Two details worthy of
note:

1. Due to lack of formal support for Zeek on Windows, generation of Zeek logs
from pcaps is performed with
[our own Zeek port](https://github.com/brimsec/zeek). Issue
[zeek/951](https://github.com/zeek/zeek/issues/951) tracks the effort to
upstream our changes.

2. We sign the Windows installer we create with every new Brim release;
however, you may still see a Microsoft Defender SmartScreen popup when you run
the installer. This is because Brim, and the signing certificate we use, are
both new, and Defender considers number of application installs and certificate
uses when determining whether or not to display the SmartScreen popup. Once we
have enough Brim Windows installations, Defender should stop doing this.  We do
recommend that you click on the "More Info" link in the SmartScreen popup and
verify that the installer is signed by `Brim Security, Inc.`.

We recommend this blog post if you'd like more info on Windows code signing:
https://support.sectigo.com/Com_KnowledgeDetailPageFaq?Id=kA01N000000zFJx

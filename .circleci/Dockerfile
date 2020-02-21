# Builds brimsec/ci:<version>-zeek-mergecap.
# Justification: Golang 1.13, Node 12, browser libs, and XVFB for free.
# Adding Zeek and mergecap.
# References.
#   https://www.zeek.org/download/packages.html
#   https://software.opensuse.org//download.html?project=security%3Azeek&package=zeek
# Instructions:
# docker build -f Dockerfile .
# docker tag <image> brimsec/ci:<version>-zeek-mergecap
# docker push brimsec/ci:<version>-zeek-mergecap
FROM circleci/golang:1.13-buster-node-browsers

RUN sudo bash -c "echo 'deb http://download.opensuse.org/repositories/security:/zeek/Debian_10/ /' > /etc/apt/sources.list.d/security:zeek.list" \
    && curl https://download.opensuse.org/repositories/security:/zeek/Debian_10/Release.key | sudo apt-key add - \
    && sudo apt-get update \
    && sudo apt-get -y install \
        wireshark-common \
        zeek \
    && sudo apt-get -y clean \
    && sudo apt-get -y autoremove

ENV PATH "/opt/zeek/bin:$PATH"

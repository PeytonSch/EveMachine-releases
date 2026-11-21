# Eve Machine

A free desktop companion for [EVE Online](https://www.eveonline.com) on Windows. Log in your characters once and keep everything about them in one place: where your stuff is, what it's worth, what to build, what you mined, and who just jumped into local.

## Download

**[Download the latest installer](https://github.com/PeytonSch/EveMachine-releases/releases/latest/download/EveMachine-Setup.exe)** (Windows 10 and 11, 64-bit), or pick a version on the [Releases page](https://github.com/PeytonSch/EveMachine-releases/releases).

1. Run `EveMachine-Setup.exe`. It installs for your Windows user only (no administrator prompt).
2. Open Eve Machine, click **Add Character** and log in on EVE Online's website in your normal browser.
3. On first launch, let it download CCP's latest static data (a minute or so).

> The installer isn't code-signed yet, so Windows SmartScreen may say "Windows protected your PC". Click **More info → Run anyway**. Each release lists SHA-256 checksums in `SHA256SUMS.txt`.

Installed copies update themselves: Eve Machine tells you when a new version is out and installs it when you choose.

## Problems and ideas

Open an [issue](https://github.com/PeytonSch/EveMachine-releases/issues). If something broke, attach the log file: **Application Settings → Application → Log file → Open folder**.

## About this repository

This repository holds Eve Machine's releases and its download website (`site/`, published with Cloudflare Pages). The source code is kept separately; each release here is built and published automatically from it.

## Privacy

Everything Eve Machine stores stays on your computer. There is no Eve Machine server, account or analytics. You log in on CCP's own website, so Eve Machine never sees your EVE password, and you can revoke its access at any time at [community.eveonline.com/support/third-party-applications](https://community.eveonline.com/support/third-party-applications/).

## Legal

EVE Online and the EVE logo are the registered trademarks of CCP hf. All rights are reserved worldwide. All other trademarks are the property of their respective owners. EVE Online, the EVE logo, EVE and all associated logos and designs are the intellectual property of CCP hf. All artwork, screenshots, characters, vehicles, storylines, world facts or other recognizable features of the intellectual property relating to these trademarks are likewise the intellectual property of CCP hf. CCP hf. has granted permission to Eve Machine to use EVE Online and all associated logos and designs for promotional and information purposes but does not endorse, and is not in any way affiliated with, Eve Machine. CCP is in no way responsible for the content on or functioning of this program, nor can it be liable for any damage arising from the use of this program.

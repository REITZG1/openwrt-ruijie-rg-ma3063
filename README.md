# OpenWrt for Ruijie RG-MA3063

This tree adds support for the **Ruijie RG-MA3063** (China Mobile custom unit):
IPQ5018 + QCN6122 WiFi 6, 256MB RAM, 128MB SPI-NAND, external QCA8337 switch
(3x LAN + 1x WAN). Base: OpenWrt 25.12.5, kernel 6.12.94, `qualcommax/ipq50xx`.

> Prebuilt images: [Releases](https://github.com/REITZG1/openwrt-ruijie-rg-ma3063/releases)
> (`factory.ubi` = flash via U-Boot serial, `sysupgrade.bin` = upgrade from
> running OpenWrt, `initramfs-uImage.itb` = TFTP test boot without flashing).

## Hardware status

| Part | Status |
|---|---|
| Ethernet (QCA8337, all 4 ports) | Working, warm + cold boot tested |
| WiFi 2.4G / 5G (ath11k, AX) | Working; use HE20 / HE80 (HE160 triggers DFS wait) |
| LuCI web UI | Working (AX/AC modes selectable) |
| NAND tested | Macronix SPI NAND 128MiB (MX35UF1GE4AC) |
| NAND NOT tested | Units with Fudan Micro chip — do not flash |

## Flashing (serial/TTL required, 115200 baud)

1. **Back up first** over serial: `ART` + `rootfs` + `rootfs_1` partitions.
   Wrong flash = brick; lost ART = WiFi broken forever.
2. TFTP-boot `initramfs-uImage.itb` to test without touching flash.
3. Flash `factory.ubi` to **both** `rootfs` and `rootfs_1` slots
   (U-Boot picks either slot; flashing one slot can roll back to stock).
4. First boot IP is `192.168.1.1`, root password empty — run `passwd` immediately.

## Building

```bash
./scripts/feeds update -a && ./scripts/feeds install -a
cp <this-repo>/.config .config   # or: make menuconfig, target qualcommax/ipq50xx, device ruijie_rg-ma3063
make -j$(nproc)
```

Build on a native Linux filesystem (ext4). NTFS/Windows checkouts break ~1000+
symlinks (`staging_dir`, toolchain) and must not be used for building.
Device files: `target/linux/qualcommax/files/arch/arm64/boot/dts/qcom/ipq5018-rg-ma3063.dts`,
`target/linux/qualcommax/image/ipq50xx.mk`. The DTS must keep the QCA8337 reset
on **GPIO 26** with MDIO reset delays, matching the stock DTB.

## Known quirks

- `HE160` on 5G channel 36 pulls in DFS channels (60s CAC wait) — use `HE80`.
- 256MB RAM is tight for ath11k; avoid heavy packages.
- Dual-boot U-Boot: keep both slots on OpenWrt or both on stock, never mixed.

---

![OpenWrt logo](include/logo.png)

OpenWrt Project is a Linux operating system targeting embedded devices. Instead
of trying to create a single, static firmware, OpenWrt provides a fully
writable filesystem with package management. This frees you from the
application selection and configuration provided by the vendor and allows you
to customize the device through the use of packages to suit any application.
For developers, OpenWrt is the framework to build an application without having
to build a complete firmware around it; for users this means the ability for
full customization, to use the device in ways never envisioned.

Sunshine!

## Download

Built firmware images are available for many architectures and come with a
package selection to be used as WiFi home router. To quickly find a factory
image usable to migrate from a vendor stock firmware to OpenWrt, try the
*Firmware Selector*.

* [OpenWrt Firmware Selector](https://firmware-selector.openwrt.org/)

If your device is supported, please follow the **Info** link to see install
instructions or consult the support resources listed below.

## 

An advanced user may require additional or specific package. (Toolchain, SDK, ...) For everything else than simple firmware download, try the wiki download page:

* [OpenWrt Wiki Download](https://openwrt.org/downloads)

## Development

To build your own firmware you need a GNU/Linux, BSD or macOS system (case
sensitive filesystem required). Cygwin is unsupported because of the lack of a
case sensitive file system.

### Requirements

You need the following tools to compile OpenWrt, the package names vary between
distributions. A complete list with distribution specific packages is found in
the [Build System Setup](https://openwrt.org/docs/guide-developer/build-system/install-buildsystem)
documentation.

```
binutils bzip2 diff find flex gawk gcc-6+ getopt grep install libc-dev libz-dev
make4.1+ perl python3.7+ rsync subversion unzip which
```

### Quickstart

1. Run `./scripts/feeds update -a` to obtain all the latest package definitions
   defined in feeds.conf / feeds.conf.default

2. Run `./scripts/feeds install -a` to install symlinks for all obtained
   packages into package/feeds/

3. Run `make menuconfig` to select your preferred configuration for the
   toolchain, target system & firmware packages.

4. Run `make` to build your firmware. This will download all sources, build the
   cross-compile toolchain and then cross-compile the GNU/Linux kernel & all chosen
   applications for your target system.

### Related Repositories

The main repository uses multiple sub-repositories to manage packages of
different categories. All packages are installed via the OpenWrt package
manager called `opkg`. If you're looking to develop the web interface or port
packages to OpenWrt, please find the fitting repository below.

* [LuCI Web Interface](https://github.com/openwrt/luci): Modern and modular
  interface to control the device via a web browser.

* [OpenWrt Packages](https://github.com/openwrt/packages): Community repository
  of ported packages.

* [OpenWrt Routing](https://github.com/openwrt/routing): Packages specifically
  focused on (mesh) routing.

* [OpenWrt Video](https://github.com/openwrt/video): Packages specifically
  focused on display servers and clients (Xorg and Wayland).

## Support Information

For a list of supported devices see the [OpenWrt Hardware Database](https://openwrt.org/supported_devices)

### Documentation

* [Quick Start Guide](https://openwrt.org/docs/guide-quick-start/start)
* [User Guide](https://openwrt.org/docs/guide-user/start)
* [Developer Documentation](https://openwrt.org/docs/guide-developer/start)
* [Technical Reference](https://openwrt.org/docs/techref/start)

### Support Community

* [Forum](https://forum.openwrt.org): For usage, projects, discussions and hardware advise.
* [Support Chat](https://webchat.oftc.net/#openwrt): Channel `#openwrt` on **oftc.net**.

### Developer Community

* [Bug Reports](https://bugs.openwrt.org): Report bugs in OpenWrt
* [Dev Mailing List](https://lists.openwrt.org/mailman/listinfo/openwrt-devel): Send patches
* [Dev Chat](https://webchat.oftc.net/#openwrt-devel): Channel `#openwrt-devel` on **oftc.net**.

## License

OpenWrt is licensed under GPL-2.0

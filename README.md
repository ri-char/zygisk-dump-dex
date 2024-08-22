# Zygisk Dump Dex

This repository is a demo project which hook `libdexfile.so` to dump dex. This is **only** test on my Android 14.

**⚠️⚠️Use it at your own risk.⚠️⚠️**

## Building

### 1. Setup tools

It requires `just` version 1.29.0 or later. You can install it with `cargo`:
```shell
cargo install just
```

It also need `cargo-ndk` for cross-compiling:
```shell
rustup target add aarch64-linux-android
cargo install cargo-ndk
```

### 3. Build the project

```shell
just package-release # output is `out/zygisk-debug.zip`
just flash-release # flash the zip to your device (only for KernelSU)
```
## Usage

1. Install the module via KernelSU and reboot your device.
2. Put the package name of the app you want to dump dex into `/data/adb/module/dump_dex/list.txt`.
3. Lunch the app you want to dump dex.
4. The dex file will be dumped into `/data/data/<package_name>/dexes/`.
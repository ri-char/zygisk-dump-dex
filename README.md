# Zygisk Dump Dex

This repository is a demo project which hook `libdexfile.so` to dump dex. This is **only** test on my Android 14,15.

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
## Instructions
### KernelSU & Apatch
- KSU WebUI

### Magisk
- Action button to open WebUI
- Support [KSUWebUIStandalone](https://github.com/5ec1cff/KsuWebUIStandalone) and [MMRL](https://github.com/MMRLApp/MMRL)

default:
  @just --list

[doc('Build rust library for android')]
build:
    # cargo ndk -t arm64-v8a -t armeabi-v7a -t x86 -t x86_64 --platform=29 --bindgen build
    cargo ndk -t arm64-v8a --platform=29 --bindgen build

[doc('Build a zip module for KernelSU')]
package: build
    [[ -d out ]] || mkdir -p out
    [[ ! -d out/debug ]] || rm -rf out/debug
    cp -r module out/debug
    mkdir out/debug/zygisk
    cp target/aarch64-linux-android/debug/libzygisk.so out/debug/zygisk/arm64-v8a.so
    # cp target/armv7-linux-androideabi/debug/libzygisk.so out/debug/zygisk/armeabi-v7a.so
    # cp target/i686-linux-android/debug/libzygisk.so out/debug/zygisk/x86.so
    # cp target/x86_64-linux-android/debug/libzygisk.so out/debug/zygisk/x86_64.so
    cd out/debug/ && zip -r ../zygisk-debug.zip .

[doc('Flash zygisk-debug.zip to your device')]
flash: package
    adb push out/zygisk-debug.zip /data/local/tmp/
    adb shell su -c "/data/adb/ksud module install /data/local/tmp/zygisk-debug.zip"

[doc('Build rust library for android')]
build-release:
    # cargo ndk -t arm64-v8a -t armeabi-v7a -t x86 -t x86_64 --platform=29 --bindgen build --release
    cargo ndk -t arm64-v8a --platform=29 --bindgen build --release

[doc('Build a zip module for KernelSU')]
package-release: build-release
    [[ -d out ]] || mkdir -p out
    [[ ! -d out/release ]] || rm -rf out/release
    cp -r module out/release
    mkdir out/release/zygisk
    cp target/aarch64-linux-android/release/libzygisk.so out/release/zygisk/arm64-v8a.so
    # cp target/armv7-linux-androideabi/release/libzygisk.so out/release/zygisk/armeabi-v7a.so
    # cp target/i686-linux-android/release/libzygisk.so out/release/zygisk/x86.so
    # cp target/x86_64-linux-android/release/libzygisk.so out/release/zygisk/x86_64.so
    cd out/release/ && zip -r ../zygisk-release.zip .

[doc('Flash zygisk-debug.zip to your device')]
flash-release: package-release
    adb push out/zygisk-release.zip /data/local/tmp/
    adb shell su -c "/data/adb/ksud module install /data/local/tmp/zygisk-release.zip"
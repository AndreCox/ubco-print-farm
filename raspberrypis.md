# Raspberry Pi Setup

## Software Installation

You can find the Raspberry Pi disk image [here](https://octoprint.org/download/).
At the time of writing this the latest version is OctoPi 1.0.0 with Octoprint 1.9.0

The download link is at the bottom of the page.

After downloading it I recommend installing it with Balena Etcher which you can download [here](https://etcher.balena.io/). This should be rather easy just plug the Raspberry Pi's SD Cards into your computer and flash each one

## Configuration Changes

Before we boot the Raspberry Pi's we must make some changes to the `config.txt` file located in the root of the Raspberry Pi's SD card.

You can open this file in a text editor and scroll to the bottom of the file you should see a section that looks something like this.

```ini
[all]

[pi4]
# Run as fast as firmware / board allows
arm_boost=1

[all]
# enable raspicam
start_x=1
gpu_mem=128
```

You need to add to lines at the bottom to make it look like this.

```ini
[all]

[pi4]
# Run as fast as firmware / board allows
arm_boost=1

[all]
# enable raspicam
start_x=1
gpu_mem=128

# Add these two lines to each raspberry pi sd card
enable_uart=1
dtoverlay=disable-bt
```

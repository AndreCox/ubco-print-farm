# Hardware

## Overview

A list of the hardware used for this project is listed below.

### Hardware List

| Component                    | Quanitiy                                                           | Description                                                                                                                                                                               |
| ---------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Raspberry Pi 4 B+            | Same number as printers                                            | These are used for the Octoprint servers. They are a little pricy but keeping with the stock Pi's makes software installation easier.                                                     |
| Raspberry Pi Camera          | Same number as printers                                            | These are used for monitoring the print.                                                                                                                                                  |
| Raspberry Pi Camera Cable 61cm| Same number as printers                                            | These are used for connecting the camera to the Raspberry Pi. We just need some extra length. I chose these one's from [Digikey](https://www.digikey.ca/en/products/detail/adafruit-industries-llc/1731/6238161)                                                                                                                     |
| Prusa I3 MK3s+               | As many as you have                                                | Technically this project will work with other printers but this project is written specifically with these printers in mind.                                                              |
| Buck Converters              | Same number as printers                                            | These are used for stepping down the 24V printer power to 5V Raspberry Pi power. I chose the [DFR0831](https://www.digikey.ca/en/products/detail/dfrobot/DFR0831/14322651) by DFRobot as these are of a high quality                                            |
| Cat5 Ethernet Cables         | 2 more that the amount of printers you have                        | Should be the long enough to connect from your printers to the network switch. The extras are used for connecting to the central server, and for configuring the system through a laptop. |
| 16 port network switch 1Gbit | 1, you can add more if you have more printers and daisy chain them | Used to connect all the devices together which bypasses the secure WiFi, should cost about $100                                                                                           |


### Tools List

| Tool | Description |
| ---- | ----------- |
| Soldering Iron | Used to solder the buck converters to make the wiring harnesses to connect the printers to the Raspberry Pi's |
| RJ45 Crimper | Used to make the Ethernet cables (you could buy pre-made cables) |
| Dupont Crimper | Used to make the wiring harnesses to connect the printers to the Raspberry Pi's |
| Wire Strippers | Used to cut and strip the wires for the wiring harnesses to connect the printers to the Raspberry Pi's |
| 3D Printer | Used to print the cases for the Raspberry Pi's and the camera mounts |

### 3D Printed Parts List
| Part | Description | Quantity |  Link |
| ---- | ----------- | ---- | ------ |
| Prusa MK3s+ Raspberry Pi + electronics Case | This is the case that holds the Raspberry Pi's and printer electronics | Same as number of printers | https://www.printables.com/model/9284-prusa-i3-octoprint-raspberry-pi-case |
| Prusa MK3s+ Raspberry Pi Camera Mount | This is the mount that holds the Raspberry Pi Camera | Same as number of printers | https://www.printables.com/model/46866-prusa-mk3s-mk3s-pi-camera-v21-mount-with-optional- |

## Printer Modifications

To make the installation as seamless as possible we make some hardware modifications to the 3D printer to allow us to fit the Pi's inside the printers electronics case. This necessitates printing a new electronics case.

You can find a link to the parts and some documentation about these parts here.
https://www.printables.com/model/9284-prusa-i3-octoprint-raspberry-pi-case

For this part I printed it in ASA which is very durable.

# Hardware

## Overview

A list of the hardware used for this project is listed below.

| Component                    | Quanitiy                                                           | Description                                                                                                                                                                               |
| ---------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Raspberry Pi 4 B+            | Same number as printers                                            | These are used for the Octoprint servers. They are a little pricy but keeping with the stock Pi's makes software installation easier.                                                     |
| Prusa I3 MK3s+               | As many as you have                                                | Technically this project will work with other printers but this project is written specifically with these printers in mind.                                                              |
| Cat5 Ethernet Cables         | 2 more that the amount of printers you have                        | Should be the long enough to connect from your printers to the network switch. The extras are used for connecting to the central server, and for configuring the system through a laptop. |
| 16 port network switch 1Gbit | 1, you can add more if you have more printers and daisy chain them | Used to connect all the devices together which bypasses the secure WiFi, should cost about $100                                                                                           |

## Printer Modifications

To make the installation as seamless as possible we make some hardware modifications to the 3D printer to allow us to fit the Pi's inside the printers electronics case. This necessitates printing a new electronics case.

You can find a link to the parts and some documentation about these parts here.
https://www.printables.com/model/9284-prusa-i3-octoprint-raspberry-pi-case

For this part I printed it in ASA which is very durable.

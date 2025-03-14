# Hancock IMU Alignment Tool

Helps determining IMU angles for Hancock platform devices. Either select one of the presets or orient the device with yaw, pitch, roll controls until it matches your installation situation.

To execute locally run ```webserver.py``` with a Python interpreter. Then browse to http://localhost:8888/.


![Info](https://raw.githubusercontent.com/renestraub/hancock_imu_angle/main/preview/screenshot1.png)


### Revision History

#### v0.3.0 (20230121)

- Support for NITROC with ZED-F9


#### v0.3.0 (20230121)

- Support for NG800/VCU Pro with NEO-M9 prepared
- Added drop down to select device


#### v0.2.0 (20210405)

- Use black Hancock enclosure model.
- Improve UI by using rectangular 3D canvas.
- Improve lighting for better model recognition.
- Add View Rotation feature.
- Use local installation of Three.JS.
- Fix typo in script statement, code cleanup.


#### v0.1.0 (20210322)

- Rearrange angles to Yaw - Pitch - Roll order. This reflects the order in which the transformations take place.
- UI improvements: Display angles in canvas, help texts for coordinate systems and rotation order.
- Confirm additional IMU angles.
- Internal rework to use Three.JS coordinate system w/o additional transformations.


#### v0.0.3 (20210227)

- Update with CAD model of Hancock enclosure
- Confirm additional IMU angles

#### v0.0.2 (20210221)

- Initial release

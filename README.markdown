# Plotly latency-monitor ![](https://img.shields.io/badge/version-1.0.0-yellow.svg)

![alt text](https://github.com/SterlingButters/plotly-latency-monitot/blob/master/Latency.gif)

## About
This repo utilizes the npm `express` & `net-ping` packages to determine the external ip address(es)
of connections made to a webpage hosted on a specified port and then pinging them to acquire the
round-trip-time which is then plotted using `plotly.js` stream API. The accuracy of the RTT acquired
using `net-ping` is questionable according to documentation. Results for my application have
proven to show little deviation from results acquired using the Unix ping command, however, the
maximum level of precision achieved with `net-ping` is to the nearest millisecond while the Unix
command can achieve precision down to 1/1000th of a millisecond (this would also make the graph look
better). While using `spawn` to spawn a child process using `Node.js` would technically be preferable
in order to achieve this precision, handling of the resulting data is difficult given that it must be
retrieved from stdout.

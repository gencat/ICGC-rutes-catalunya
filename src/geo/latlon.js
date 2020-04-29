// @flow

// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

"use strict";

/**
 * A `LatLon` object represents a given latitude and longitude coordinates.
 *
 * @param {number} lat Latitude, measured in degrees.
 * @param {number} lon Longitude, measured in degrees.
 * @example
 * var ll = new LatLon(42.10376, 1.84584);
 */
class LatLon {


	constructor(lat, lon) {

		const areNumbers = !(isNaN(lat) || isNaN(lon));
		if (areNumbers) {

			this.lat = +lat;
			this.lon = +lon;

			const validRange = this.lat > -90 && this.lat < 90 &&
				this.lon > -180 && this.lon < 180;

			if (!validRange) {

				throw new Error("Invalid LatLon value: Latitude must be between -90 and 90 and Longitude must be between -180 and 180");

			}

		} else {

			throw new Error(`Invalid LatLon object: (${lat}, ${lon})`);

		}

	}

	/**
	 * Set the latitude
	 *
	 * @param {number} lat
	 * @returns {LatLon} `this`
	 */
	setLatitude(lat) {

		this.lat = lat;
		return this;

	}

	/**
	 * Set the longitude
	 *
	 * @param {number} lon
	 * @returns {LatLon} `this`
	 */
	setLongitude(lon) {

		this.lon = lon;
		return this;

	}

	/**
	 * Returns the LatLon object as a string.
	 *
	 * @returns {string} The coordinates as a string in the format `'LatLon(lat, lng)'`.
	 * @example
	 * var ll = new LatLon(42.10376, 1.84584);
	 * ll.toString(); //"LatLon(42.10376, 1.84584)"
	 */
	toString() {

		return `LatLon(${this.lat}, ${this.lon})`;

	}

}

module.exports = LatLon;

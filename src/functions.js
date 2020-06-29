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

export var rutes = (function () {

	var checkOptions = function (concepte) {

		const opt = {
			color: Cesium.Color.YELLOW,
			font: "10px Helvetica",
			far: 1500
		};

		if (concepte == "curs fluv." || concepte == "hidr.") {

			opt.color = Cesium.Color.AQUA;
			opt.font = "9px Helvetica";
			opt.far = 3000;

		}


		if (concepte == "orogr." || concepte == "serra" || concepte == "coll") {

			opt.color = Cesium.Color.PALEGREEN,
				opt.font = "12px Helvetica";
			opt.far = 5000;

		}


		if (concepte == "cim") {

			opt.color = Cesium.Color.SPRINGGREEN,
				opt.font = "13px Helvetica";
			opt.far = 6000;

		}

		return opt;

	}


	const addTemplateInfoElevation = function (trackGeoJSON, controlElevation, MAPSTATE) {

		try {

			const desc = MAPSTATE.description == "" ? "ruta usuari" : "Inici " + MAPSTATE.description;
			$("#nomRutaH").html(MAPSTATE.title);
			$("#llocRutaH").html(desc);
			$("#elevation-div").show();
			$("#sideBt").show();


			controlElevation.clear();

			const oo = controlElevation.load(trackGeoJSON);

			controlElevation.on("eledata_added", (a) => {
				const track = a.track_info;
				const desnivell = parseInt(track.elevation_max) - parseInt(track.elevation_min)

				$("#totlen").html(`Distància: ${track.distance.toFixed(2)} km <i class="arrows alternate horizontal right ui icon">`);
				$("#desni").html(`Desnivell: ${desnivell} m <i class="arrows alternate vertical ui icon">`);
				$("#maxele").html(`Alçada màxima: ${parseInt(track.elevation_max)} m <i class="level up alternate ui icon">`);
				$("#minele").html(`Alçada mínima: ${parseInt(track.elevation_min)} m <i class="level down alternate ui icon">`);


			});


		} catch (err) {

			console.info(err);

		}

	}




	return {
		checkOptions: checkOptions,
		addTemplateInfoElevation: addTemplateInfoElevation
	};
})();

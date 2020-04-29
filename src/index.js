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
const fa = require("./utils");
const west = 2.0;
const south = 42.0;
const east = 2.1;
const north = 42.2;
let trackDataSource = null;

let trackGeoJSON = null;
const URL_ORTO = "https://geoserveis.icgc.cat/icc_mapesmultibase/noutm/wmts/orto/GRID3857/{z}/{x}/{y}.jpeg";
const URL_carreteres = "https://tilemaps.icgc.cat/mapfactory/wmts/hibrida_total/CAT3857/{z}/{x}/{y}.png";
const URL_TOPO = "https://tilemaps.icgc.cat/mapfactory/wmts/topo_suau/CAT3857/{z}/{x}/{y}.png";
const URL_GEOL = "https://tilemaps.icgc.cat/mapfactory/wmts/geologia/MON3857NW/{z}/{x}/{y}.png";
const URL_RELLEU = "https://tilemaps.icgc.cat/mapfactory/wmts/gris_topo_suau/CAT3857/{z}/{x}/{y}.png";
const URL_ADMIN = "https://tilemaps.icgc.cat/mapfactory/wmts/limits/CAT3857/{z}/{x}/{y}.png";
const URL_TOPONIM = "https://tilemaps.icgc.cat/mapfactory/wmts/toponimia/CAT3857/%7Bz%7D/%7Bx%7D/%7By%7D.png";
let URL_TERRENY = "https://tilemaps.icgc.cat/terrenys/demextes";
let fakeMap;
let controlElevation;

let imPro;
var urlApp = "http://localhost:9966" //"https://betaserver.icgc.cat/rutes-catalunya/"  

const dev = true;
let viewer;

let rutaIniciada = false;
let isInPause = true;
let labelsDatasource;

let capturer;

$(".ui.fluid.dropdown")
	.dropdown({
		maxSelections: 3,
	})
;
$(".label.ui.dropdown")
	.dropdown();

$(".no.label.ui.dropdown")
	.dropdown({
		useLabels: false
	});

$(".ui.button").on("click", () => {

	$(".ui.dropdown")
		.dropdown("restore defaults");

});

$(".ui.button.fileRequest").click(function () {

	const ruta = $(this).attr("data-gpx");
	console.log("onDownload");
	window.location = ruta;

});


$(window.document).ready(() => {

	Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(west, south, east, north);

	if (dev) {

		imPro = new Cesium.ArcGisMapServerImageryProvider( {
			url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer?",
			id: "ortogis",
			enablePickFeatures: false,
			maximumLevel: 18,
			credit: "ArcGIS",
			
		})
		
		
		URL_TERRENY = "https://tilemaps.icgc.cat/terrenys/demextes";


	} else {


		imPro = new Cesium.WebMapTileServiceImageryProvider({
			url: "http://localhost/mapcache/wmts/?",
			layer: "orto",
			style: "default",
			format: "image/png",
			tileMatrixSetID: "GMTOT",
			maximumLevel: 18,
			credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya")
		});

		URL_TERRENY = "https://tilemaps.icgc.cat/terrenys/demextes";

	}
	Cesium.Resource.supportsImageBitmapOptions = function () {

		return Cesium.when.resolve(false);

	};

	viewer = new Cesium.Viewer("map", {

		imageryProvider: imPro,
		timeline: false,
		fullscreenElement: false,
		fullscreenButton: false,
		navigationHelpButton: false,
		scene3DOnly: true,
		baseLayerPicker: false,
		homeButton: false,
		infoBox: true,
		sceneModePicker: false,
		shouldAnimate: false,
		animation: false,
		geocoder: false,
		targetFrameRate: 40,
		vrButton: false,
		showRenderLoopErrors: false,
		useDefaultRenderLoop: true,
		orderIndependentTranslucency: true,
		sceneMode: Cesium.SceneMode.SCENE3D,
		terrainProvider: new Cesium.CesiumTerrainProvider({
			url: URL_TERRENY
		})
	});


	const scene = viewer.scene;
	scene.globe.depthTestingAgainstTerrain = true;
	const camera = viewer.scene.camera;
	viewer.scene.globe.enableLighting = true;
	viewer.scene.fog.enabled = true;
	viewer.scene.fog.density = 0.0002;
	viewer.scene.fog.screenSpaceErrorFactor = 2;

	$("#infobox").hide();


	vistaInicial();
	initElevation();
	initEvents();
	setupLayers();
	initFromQuery();

	//
	function initFromQuery() {
			
		var url = $.url().param();

		if (url.capes && url.capes.indexOf(",") != -1) {

				var capa = url.capes.split(",");

				var initServei1 = getUrlCapesFromCapa(capa[0], layersArray);
				servicio1 = initServei1.url;
				layer1 = initServei1.layer;

				var initServei2 = getUrlCapesFromCapa(capa[1], layersArray);
				servicio2 = initServei2.url;
				layer2 = initServei2.layer;

				var initServei3 = getUrlCapesFromCapa(capa[2], layersArray);
				servicio3 = initServei3.url;
				layer3 = initServei3.layer;

				var initServei4 = getUrlCapesFromCapa(capa[3], layersArray);
				servicio4 = initServei4.url;
				layer4 = initServei4.layer;

				var initServei5 = getUrlCapesFromCapa(capa[4], layersArray);
				servicio5 = initServei5.url;
				layer5 = initServei5.layer;

				var initServei6 = getUrlCapesFromCapa(capa[5], layersArray);
				servicio6 = initServei6.url;
				layer6 = initServei6.layer;

				var initServei7 = getUrlCapesFromCapa(capa[6], layersArray);
				servicio7 = initServei7.url;
				layer7 = initServei7.layer;

				var initServei8 = getUrlCapesFromCapa(capa[7], layersArray);
				servicio8 = initServei8.url;
				layer8 = initServei8.layer;
	}
	// end URL pURL

	}

	function showEntitiesLabels(value) {

		if (labelsDatasource) {

			labelsDatasource.show = value;
			return true;

		}

	}


	function checkOptions(concepte) {

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


	function addToponims(toponimsGeoJson) {


		viewer.entities.removeAll();

		jQuery.getJSON(`dist/data/rutes/MAP_NAME_${toponimsGeoJson.replace("gpx", "geojson")}`, (respuestaGeonames) => {

			for (let i = 0; i < respuestaGeonames.features.length; i++) {

				if (respuestaGeonames.features[i].properties.Concepte != "edif.") {

					const entity = respuestaGeonames.features[i];


					const opt = checkOptions(entity.properties.Concepte);
					//console.log('prop', entity.properties)


					viewer.entities.add({
						position: Cesium.Cartesian3.fromDegrees(entity.geometry.coordinates[0], entity.geometry.coordinates[1], entity.geometry.coordinates[2]),
					
						label: {

							text: entity.properties.Toponim,
							font: opt.font,
							fillColor: opt.color,
							outlineColor: Cesium.Color.BLACK,
							outlineWidth: 4,
							distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, opt.far),

							style: Cesium.LabelStyle.FILL_AND_OUTLINE,
							pixelOffset: new Cesium.Cartesian2(0, -9),
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
						}

					});


				} // en if

				//console.info(i,respuestaGeonames.features.length - 1 );

				if (i == (respuestaGeonames.features.length - 1)) {


					jQuery("#menuSearch").removeClass("vermell");

				}

			}//en for label


		});//end then


	}


	const layersa = viewer.scene.imageryLayers;

	function initElevation() {

		const elevationOptions = {
			theme: "lightblue-theme",
			detached: true,
			elevationDiv: "#elevation-div",
			width: jQuery('#elevation-div').outerWidth(),
		
			autohide: false,
			collapsed: false,
			position: "bottom",
			followMarker: false,
			imperial: false,
			reverseCoords: false,
			summary: "multiline",

		};

			fakeMap = new L.Map("fakemap");
			controlElevation = L.control.elevation(elevationOptions).addTo(fakeMap);
		  
	}


	function initEvents() {

	
		
		$("#uploadbutton").on("change", () => {

			console.log("onUpload");
			const ruta = document.getElementById("uploadbutton").files[0];
			const gpx = $(ruta).attr("name");
			console.log("valuegpx -->", gpx);

			if (ruta != null) {

				$("#controls").show();
				$("#pausa").hide();
				$("#loading").hide();
				$("#prompt").hide();
				showEntitiesLabels(false);
				rutaIniciada = false;
				console.log("path-->", ruta);
				$("#uploadButton").prop("name", ruta);
				viewer.dataSources.removeAll();
				loadGPX(gpx);
				console.log("rutaok");

			}

		});

		$("#selectRutes").on("change", function () {

			if (this.value != null) {


				$("#controls").show();
				$("#pausa").hide();
				$("#loading").hide();
				showEntitiesLabels(false);
				rutaIniciada = false;
				loadGPX(this.value);
				$("#elevationbutton").load(this.value)
			};

		});


		jQuery("#menuIcon").on("click", () => {
	
			$("#sideBarOptions").first()
				.sidebar("toggle");

			$("toggle")
				.removeClass("disabled")
			;

		});

		jQuery("#play").on("click", () => {

			if (rutaIniciada) {


				isInPause = !isInPause;
				enterPauseMode(isInPause);

				

			} else {

				showEntitiesLabels(true);

				jQuery("#loading").show(1000, (e) => {

					rutaIniciada = true;

					console.log("comença");
					startPlaying();
					$("#loading").hide();
					jQuery("#play i").removeClass("circular play icon");
					jQuery("#play i").addClass("circular pause icon");


				});
				isInPause = false;

			}

		});

		$("#playpausa").on("click", () => {

		
			enterPauseMode(false);
			$("#pausa").show();
			$("#loading").hide();
			
			$("#play").hide();

		});


		$("#stopvideobutton").on("click", () => {

			console.log("stopvideo-->click");

			stopRender();


		});
		$("#savevideobutton").on("click", () => {

			console.log("savevideo-->click");

			saveRender();


		});

		$("#home").on("click", () => {

			if (rutaIniciada) {

				
				startPlaying().oldCoord = null;
				startPlaying().distance = 0;
				startPlaying().oldElev = null;
				startPlaying().desnivellPositiu = 0;
				startPlaying().desnivellNegatiu = 0;

				jQuery("#play i").removeClass("circular play icon");
				jQuery("#play i").addClass("circular pause icon");


			}

		});

		$("#erasefilebutton").on("click", () => {

			console.log("clickerase");
			setupPause();


			if (viewer.dataSources.contains(gpxDataSource)) {


				viewer.dataSources.removeAll();


			}

			$("#infobox").hide();


		});

		$(".ui.search")
			.search({
				source: rutesJSON,
				minCharacters: 2,

				searchFields: [
					"title",
					"description"
				],
				maxResults: 7,
				fullTextSearch: "exact",
				onSelect: function (result) {

					console.log("search");
					if (result.id != null) {


						resetPlay();
						$("#controls").show();
						$("#pausa").hide();
						$("#loading").hide();

						showEntitiesLabels(false);
						rutaIniciada = false;
						loadGPX(result.id);


					}

				}
			})
		;

		$("#cimsToggle").change(function () {

			console.log("cimsToggle");

			if ($(this).is(":checked")) {

				console.log("oncims");
				
				layersa.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
					url: "http://geoserveis.icc.cat/icc_100cims/wms/service?",
					layers: "0",
					enablePickFeatures: true,
					showEntitiesLabels: true,
					credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
					parameters: {
						transparent: "true",
						format: "image/png"
					}
				}));

			} else {

				console.log("offcims");
				const layers = viewer.imageryLayers;
				//quina es?
				const baseLayer = layers.get(1);
				console.log("typeof => ", typeof layers);
				console.log("layers =>", layers);
				const layersArray = layers._layers;
				console.log(typeof layersArray);
				console.log("layers =>", layersArray);
				layersArray.map((layer, index) => {

					console.log(layer);
					console.log("imageryproveider", layer.imageryProvider);
					if (layer.imageryProvider._resource._url === "http://geoserveis.icc.cat/icc_100cims/wms/service") {

						console.log("indice =>", index);
						layers.remove(layer);

					}

				});

			}

		});

		$("#allausToggle").change(function () {

			console.log("allausToggle");

			if ($(this).is(":checked")) {

				console.log("onallaus");
				imPro = new Cesium.WebMapServiceImageryProvider({
					url: "http://siurana.icgc.cat/geoserver/nivoallaus/wms?",
					layers: "zonesallaus",
					enablePickFeatures: true,
					showEntitiesLabels: true,
					credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
					parameters: {
						transparent: "true",
						format: "image/png"
					}
				});
				var layers = viewer.imageryLayers;
				layers.addImageryProvider(imPro);

			} else {

				console.log("offallaus");
				var layers = viewer.imageryLayers;
				//quina es?
				const baseLayer = layers.get(1);
				console.log("typeof => ", typeof layers);
				console.log("layers =>", layers);
				const layersArray = layers._layers;
				console.log(typeof layersArray);
				console.log("layers =>", layersArray);
				layersArray.map((layer, index) => {

					console.log(layer);
					console.log("imageryproveider", layer.imageryProvider);
					if (layer.imageryProvider._resource._url === "http://siurana.icgc.cat/geoserver/nivoallaus/wms") {

						console.log("indice =>", index);
						layers.remove(layer);

					}

				});

			}

		});
		
		$("#toponimsToggle").change(function () {

			console.log("toponimsToggle");

			if ($(this).is(":checked")) {

				console.log("onToponims");
				imPro = new Cesium.UrlTemplateImageryProvider({
					url: URL_TOPONIM,
					enablePickFeatures: false,
					maximumLevel: 18,
					credit: "Institut Cartogràfic i Geològic de Catalunya"


				});
				var layers = viewer.imageryLayers;
				layers.addImageryProvider(imPro);

			} else {

				console.log("offToponims");
				var layers = viewer.imageryLayers;
				//quina es?
				const baseLayer = layers.get(1);
				console.log("typeof => ", typeof layers);
				console.log("layers =>", layers);
				const layersArray = layers._layers;
				console.log(typeof layersArray);
				console.log("layers =>", layersArray);
				layersArray.map((layer, index) => {

					console.log(layer);
					console.log("imageryproveider", layer.imageryProvider);
					if (layer.imageryProvider._resource._url === URL_TOPONIM) {

						console.log("indice =>", index);
						layers.remove(layer);

					}

				});

			}

		});

		
		$("#landslidesToggle").change(function () {

			console.log("landslidesToggle");

			if ($(this).is(":checked")) {

				console.log("onlandslides");
				imPro = new Cesium.WebMapServiceImageryProvider({
					url: "http://geoserveis.icgc.cat/icgc_riscgeologic/wms/service?",
					layers: "G6FIA_PA",
					enablePickFeatures: true,
					showEntitiesLabels: true,
					credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
					parameters: {
						transparent: "true",
						format: "image/png"
					}
				});
				var layers = viewer.imageryLayers;
				layers.addImageryProvider(imPro);

			} else {

				console.log("offlandslides");
				var layers = viewer.imageryLayers;
				//quina es?
				const baseLayer = layers.get(1);
				console.log("typeof => ", typeof layers);
				console.log("layers =>", layers);
				const layersArray = layers._layers;
				console.log(typeof layersArray);
				console.log("layers =>", layersArray);
				layersArray.map((layer, index) => {

					console.log(layer);
					console.log("imageryproveider", layer.imageryProvider);
					if (layer.imageryProvider._resource._url === "http://geoserveis.icgc.cat/icgc_riscgeologic/wms/service") {

						console.log("indice =>", index);
						layers.remove(layer);

					}

				});

			}

		});


		$("#carreteresToggle").change(function () {

			console.log("carreteresToggle");

			if ($(this).is(":checked")) {

				console.log("oncarreteres");
				imPro = new Cesium.UrlTemplateImageryProvider({
					url: URL_carreteres,
					enablePickFeatures: false,
					maximumLevel: 18,
					credit: "Institut Cartogràfic i Geològic de Catalunya"
				});
				var layers = viewer.imageryLayers;
				layers.addImageryProvider(imPro);

			} else {

				console.log("offcarreteres");
				var layers = viewer.imageryLayers;
				//quina es?
				const baseLayer = layers.get(1);
				console.log("typeof => ", typeof layers);
				console.log("layers =>", layers);
				const layersArray = layers._layers;
				console.log(typeof layersArray);
				console.log("layers =>", layersArray);
				layersArray.map((layer, index) => {

					console.log(layer);
					console.log("imageryproveider", layer.imageryProvider);
					if (layer.imageryProvider._resource._url === URL_carreteres) {

						console.log("indice =>", index);
						layers.remove(layer);

					}

				});

			}

		});

		$("#tancaperfilbutton").on("click", () => {

			$("#elevation-div").hide();
			controlElevation.clear();
			
		});

		$("#elevationbutton").on("click", () => {
			$("#elevation-div").show();
			controlElevation.clear();
			controlElevation.load(trackGeoJSON);
		}
			);


		$(".headerInfo").on("click", () => {
				console.info("modal")
				$(".ui.modal").modal("show");
				console.info("modal entra")
		
			});
		$("#infoallausid").on("click", () => {
				console.info("modal")
				$(".ui.modal.allaus").modal("show");
				console.info("modal entra")
		
			});
			$("#infolandslidesid").on("click", () => {
				console.info("modal")
				$(".ui.modal.esllavissades").modal("show");
				console.info("modal entra")
		
			});

//ENLLACA
		$('.enllaca').on('click', function () {
			console.info("hola enllaca")	
			
				var currentURLRaw = window.location.href.valueOf();

				const layers = viewer.imageryLayers;
		
				const layersArray = layers._layers;
				
				console.log("layers-->", layersArray)
				console.log("layer0-->", layersArray[0])
				
				//console.log("layer1-->", layersArray[1])

				let newLayersArray = []
				for (var i = 0; i < layersArray.length; i++){
					let layer = layersArray[i]
					console.log("layer->", layer)
					var found = false
					for (var x = 0; x < newLayersArray.length; x++){
						if (layer.imageryProvider._resource._url === newLayersArray[x]){
							found = true
						}
					}
					if (!found){
						newLayersArray.push(layer.imageryProvider._resource._url)
					}
				}
				//console.log("ARRAY", newLayersArray)
				const ruta = document.getElementById("uploadbutton").files[0];
				const gpx = $(ruta).attr("name");
				//console.log("valuegpx -->", ruta);

				var currentURL = urlApp + (newLayersArray.length ? `?capes=${newLayersArray.toString()}&`: '?') + "ruta=" + gpx + "&" + currentURLRaw.substring(currentURLRaw.indexOf("#"), currentURLRaw.length);
				//console.log("->>>>>>>>>> URL: ", currentURL)
				$('#urlMap').val(encodeURI(currentURL.valueOf()));
				
				var iframecode = '<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="' + currentURL.replace("#", "\\#") + '" ></iframe>';
			
				$('#iframeMap').html(iframecode);

			$('#enllacamodal').modal('show');
		});
//ENLLACA
	}


	let gpxDataSource;

	function loadGPX(gpx) {
		const ruta = `dist/data/rutes/${gpx}`;
		const lGPX = omnivore.gpx(ruta, null).on("ready", function (data) {

			$(".ui.button.fileRequest").attr("data-gpx", ruta);
			$(".ui.button.fileRequest").attr("href", ruta);
			$('.enllaca').prop("name", ruta);
			
			$("#uploadButton").prop("name", ruta);
			$("#elevationbutton").prop("elevation", trackGeoJSON);
			
						$("#infobox").hide();
			$("#elevation-div").hide();
			$("#elevation-div").removeData(trackGeoJSON);//similar

			if (viewer.dataSources.contains(gpxDataSource)) {

				const distance = 0;

				const desnivellPositiu = 0;
				const desnivellNegatiu = 0;

				viewer.dataSources.remove(gpxDataSource);
				$("#distanceLabel").text(`↦ ${(distance / 1000.0).toFixed(2)} km`);
				$("#desnivellPositiuLabel").text(`↑ ${desnivellPositiu.toFixed(2)} m`);
				$("#desnivellNegatiuLabel").text(`↓ ${desnivellNegatiu.toFixed(2)} m`);

			}


			gpxDataSource = new Cesium.CzmlDataSource();
			//console.log('ruta', ruta)
			const fly = true;

			trackGeoJSON = { type: "FeatureCollection", features: [] };


			trackGeoJSON.features.push(fa.tmUtils.extractSingleLineString(this.toGeoJSON()));


			//track base prim//
			viewer.dataSources.add(Cesium.GeoJsonDataSource.load(trackGeoJSON, {
				stroke: Cesium.Color.RED,
				fill: Cesium.Color.BURLYWOOD,
				strokeWidth: 1,
				markerSymbol: "?"
			}));
			// fi track base prim


			viewer.dataSources.add(gpxDataSource.load(fa.tmUtils.buildCZMLForTrack(trackGeoJSON, lGPX, "marker"))).then((ds) => {

			
				trackDataSource = ds;

				

				if (fly) {


					viewer.flyTo(ds, { duration: 2, });

					addToponims(gpx);
					

				} else {

					console.info("faig zoom");

					viewer.zoomTo(ds);

				}
				viewer.clock.shouldAnimate = false;


			});


		});

	}


	function setupLayers() {


		$("#iniciaHome").on("click", () => {

			console.log("entroBaseMap");
			imPro = new Cesium.ArcGisMapServerImageryProvider({
				url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer?",
				enablePickFeatures: false,
				maximumLevel: 18,
				credit: "ArcGIS"
			});

			const layers = viewer.imageryLayers;
			const baseLayer = layers.get(0);
			layers.remove(baseLayer);

			layers.addImageryProvider(imPro);
			

		});


		$("#topographicMenu").on("click", () => {

			console.log("entrotopo");
			imPro = new Cesium.ArcGisMapServerImageryProvider({
				url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer?",
				enablePickFeatures: false,
				maximumLevel: 18,
				credit: "ArcGIS"
			});
			const layers = viewer.imageryLayers;
			const baseLayer = layers.get(1);
			layers.remove(baseLayer);
			layers.addImageryProvider(imPro);
			Cesium.Hash(viewer);
			layers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
				url: URL_TOPO,
				enablePickFeatures: false,
				maximumLevel: 18,
				credit: "Institut Cartogràfic i Geològic de Catalunya"

			}))
		
			;

			if ($("#cimsToggle").is(":checked")) {

				console.log("oncims");
				
				layersa.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
					url: "http://geoserveis.icc.cat/icc_100cims/wms/service?",
					layers: "0",
					enablePickFeatures: true,
					showEntitiesLabels: true,
					credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
					parameters: {
						transparent: "true",
						format: "image/png"
					}
				}));

			}
			if ($("#toponimsToggle").is(":checked")) {

				console.log("onToponims");
			
				layersa.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
					url: URL_TOPONIM,
					enablePickFeatures: false,
					maximumLevel: 18,
					credit: "Institut Cartogràfic i Geològic de Catalunya"
				}));

			}
			if ($("#landslidesToggle").is(":checked")) {

				layersa.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
					url: "http://geoserveis.icgc.cat/icgc_riscgeologic/wms/service?",
					layers: "G6FIA_PA",
					enablePickFeatures: true,
					showEntitiesLabels: true,
					credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
					parameters: {
						transparent: "true",
						format: "image/png"
					}
				}));

			}
			if ($("#carreteresToggle").is(":checked")) {


				
				layersa.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
					url: URL_carreteres,
					enablePickFeatures: false,
					maximumLevel: 18,
					credit: "Institut Cartogràfic i Geològic de Catalunya"
				}));

			}
			if ($("#allausToggle").is(":checked")) {


				layersa.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
					url: "http://siurana.icgc.cat/geoserver/nivoallaus/wms?",
					layers: "zonesallaus",
					enablePickFeatures: true,
					showEntitiesLabels: true,
					credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
					parameters: {
						transparent: "true",
						format: "image/png"
					}
				}));

			}
		});


		$("#ortofotoMenu").on("click", () => {

			console.log("entroorto");
			imPro = new Cesium.ArcGisMapServerImageryProvider({
				url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer?",
				enablePickFeatures: false,
				maximumLevel: 18,
				credit: "ArcGIS"
			});
			const layers = viewer.imageryLayers;
			const baseLayer = layers.get(1);
			layers.remove(baseLayer);
			layers.addImageryProvider(imPro);
			Cesium.Hash(viewer);
			layers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
				url: URL_ORTO,
				enablePickFeatures: false,
				maximumLevel: 18,
				credit: "Institut Cartogràfic i Geològic de Catalunya"

			}));


			if ($("#cimsToggle").is(":checked")) {

				console.log("oncims");
			
				layersa.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
					url: "http://geoserveis.icc.cat/icc_100cims/wms/service?",
					layers: "0",
					enablePickFeatures: true,
					showEntitiesLabels: true,
					credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
					parameters: {
						transparent: "true",
						format: "image/png"
					}
				}));

			}
			if ($("#toponimsToggle").is(":checked")) {

				console.log("onToponims");
				//var layersa = viewer.scene.imageryLayers
				layersa.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
					url: URL_TOPONIM,
					enablePickFeatures: false,
					maximumLevel: 18,
					credit: "Institut Cartogràfic i Geològic de Catalunya"
				}));

			}
			if ($("#landslidesToggle").is(":checked")) {


				//var layersa = viewer.scene.imageryLayers
				layersa.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
					url: "http://geoserveis.icgc.cat/icgc_riscgeologic/wms/service?",
					layers: "G6FIA_PA",
					enablePickFeatures: true,
					showEntitiesLabels: true,
					credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
					parameters: {
						transparent: "true",
						format: "image/png"
					}
				}));

			}
			if ($("#carreteresToggle").is(":checked")) {


				//var layersa = viewer.scene.imageryLayers
				layersa.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
					url: URL_carreteres,
					enablePickFeatures: false,
					maximumLevel: 18,
					credit: "Institut Cartogràfic i Geològic de Catalunya"
				}));

			}
			if ($("#allausToggle").is(":checked")) {


				//var layersa = viewer.scene.imageryLayers
				layersa.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
					url: "http://siurana.icgc.cat/geoserver/nivoallaus/wms?",
					layers: "zonesallaus",
					enablePickFeatures: true,
					showEntitiesLabels: true,
					credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
					parameters: {
						transparent: "true",
						format: "image/png"
					}
				}));

			}


		});
		$("#adminMenu").on("click", () => {

			console.log("entrohibrid");

			imPro = new Cesium.ArcGisMapServerImageryProvider({
				url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer?",
				enablePickFeatures: false,
				maximumLevel: 18,
				credit: "ArcGIS"
			});
			const layers = viewer.imageryLayers;
			const baseLayer = layers.get(1);
			layers.remove(baseLayer);
			layers.addImageryProvider(imPro);
			Cesium.Hash(viewer);
			layers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
				url: URL_ADMIN,
				enablePickFeatures: false,
				maximumLevel: 18,
				credit: "Institut Cartogràfic i Geològic de Catalunya"

			}));
			if ($("#cimsToggle").is(":checked")) {

				console.log("oncims");
			
				layersa.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
					url: "http://geoserveis.icc.cat/icc_100cims/wms/service?",
					layers: "0",
					enablePickFeatures: true,
					showEntitiesLabels: true,
					credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
					parameters: {
						transparent: "true",
						format: "image/png"
					}
				}));

			}
			if ($("#toponimsToggle").is(":checked")) {

				console.log("onToponims");
				//var layersa = viewer.scene.imageryLayers
				layersa.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
					url: URL_TOPONIM,
					enablePickFeatures: false,
					maximumLevel: 18,
					credit: "Institut Cartogràfic i Geològic de Catalunya"
				}));

			}
			if ($("#landslidesToggle").is(":checked")) {


				//var layersa = viewer.scene.imageryLayers
				layersa.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
					url: "http://geoserveis.icgc.cat/icgc_riscgeologic/wms/service?",
					layers: "G6FIA_PA",
					enablePickFeatures: true,
					showEntitiesLabels: true,
					credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
					parameters: {
						transparent: "true",
						format: "image/png"
					}
				}));

			}
			if ($("#carreteresToggle").is(":checked")) {


				//var layersa = viewer.scene.imageryLayers
				layersa.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
					url: URL_carreteres,
					enablePickFeatures: false,
					maximumLevel: 18,
					credit: "Institut Cartogràfic i Geològic de Catalunya"
				}));

			}
			if ($("#allausToggle").is(":checked")) {


				//var layersa = viewer.scene.imageryLayers
				layersa.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
					url: "http://siurana.icgc.cat/geoserver/nivoallaus/wms?",
					layers: "zonesallaus",
					enablePickFeatures: true,
					showEntitiesLabels: true,
					credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
					parameters: {
						transparent: "true",
						format: "image/png"
					}
				}));

			}


		});
		$(".carreteres").on("click", () => {

			console.log("entrocarreteres");

			imPro = new Cesium.UrlTemplateImageryProvider({
				url: URL_HIBRID,
				enablePickFeatures: false,
				maximumLevel: 18,
				credit: "Institut Cartogràfic i Geològic de Catalunya"
			});

			const layers = viewer.imageryLayers;
			const baseLayer = layers.get(1);


			layers.remove(baseLayer);
			layers.addImageryProvider(imPro);


		});
		$("#relleuMenu").on("click", () => {

			console.log("entrorelleu");

			imPro = new Cesium.ArcGisMapServerImageryProvider({
				url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer?",
				enablePickFeatures: false,
				maximumLevel: 18,
				credit: "ArcGIS"
			});
			const layers = viewer.imageryLayers;
			const baseLayer = layers.get(1);
			layers.remove(baseLayer);
			layers.addImageryProvider(imPro);
			Cesium.Hash(viewer);
			layers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
				url: URL_RELLEU,
				enablePickFeatures: false,
				maximumLevel: 18,
				credit: "Institut Cartogràfic i Geològic de Catalunya"

			}));
			if ($("#cimsToggle").is(":checked")) {

				console.log("oncims");
				//var layersa = viewer.scene.imageryLayers
				layersa.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
					url: "http://geoserveis.icc.cat/icc_100cims/wms/service?",
					layers: "0",
					enablePickFeatures: true,
					showEntitiesLabels: true,
					credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
					parameters: {
						transparent: "true",
						format: "image/png"
					}
				}));

			}
			if ($("#toponimsToggle").is(":checked")) {

				console.log("onToponims");
				//var layersa = viewer.scene.imageryLayers
				layersa.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
					url: URL_TOPONIM,
					enablePickFeatures: false,
					maximumLevel: 18,
					credit: "Institut Cartogràfic i Geològic de Catalunya"
				}));

			}
			if ($("#landslidesToggle").is(":checked")) {


				//var layersa = viewer.scene.imageryLayers
				layersa.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
					url: "http://geoserveis.icgc.cat/icgc_riscgeologic/wms/service?",
					layers: "G6FIA_PA",
					enablePickFeatures: true,
					showEntitiesLabels: true,
					credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
					parameters: {
						transparent: "true",
						format: "image/png"
					}
				}));

			}
			if ($("#carreteresToggle").is(":checked")) {


				//var layersa = viewer.scene.imageryLayers
				layersa.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
					url: URL_carreteres,
					enablePickFeatures: false,
					maximumLevel: 18,
					credit: "Institut Cartogràfic i Geològic de Catalunya"
				}));

			}
			if ($("#allausToggle").is(":checked")) {


				//var layersa = viewer.scene.imageryLayers
				layersa.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
					url: "http://siurana.icgc.cat/geoserver/nivoallaus/wms?",
					layers: "zonesallaus",
					enablePickFeatures: true,
					showEntitiesLabels: true,
					credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
					parameters: {
						transparent: "true",
						format: "image/png"
					}
				}));

			}


		});
		$("#geologicMenu").on("click", () => {

			console.log("entrogeo");
			imPro = new Cesium.ArcGisMapServerImageryProvider({
				url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer?",
				enablePickFeatures: false,
				maximumLevel: 18,
				credit: "ArcGIS"
			});
			const layers = viewer.imageryLayers;
			const baseLayer = layers.get(1);
			layers.remove(baseLayer);
			layers.addImageryProvider(imPro);
			Cesium.Hash(viewer);
			layers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
				url: URL_GEOL,
				enablePickFeatures: false,
				maximumLevel: 18,
				credit: "Institut Cartogràfic i Geològic de Catalunya"

			}));
			if ($("#cimsToggle").is(":checked")) {

				console.log("oncims");
				//var layersa = viewer.scene.imageryLayers
				layersa.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
					url: "http://geoserveis.icc.cat/icc_100cims/wms/service?",
					layers: "0",
					enablePickFeatures: true,
					showEntitiesLabels: true,
					credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
					parameters: {
						transparent: "true",
						format: "image/png"
					}
				}));

			}
			if ($("#toponimsToggle").is(":checked")) {

				console.log("onToponims");
				//var layersa = viewer.scene.imageryLayers
				layersa.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
					url: URL_TOPONIM,
					enablePickFeatures: false,
					maximumLevel: 18,
					credit: "Institut Cartogràfic i Geològic de Catalunya"
				}));

			}
			if ($("#landslidesToggle").is(":checked")) {


				//var layersa = viewer.scene.imageryLayers
				layersa.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
					url: "http://geoserveis.icgc.cat/icgc_riscgeologic/wms/service?",
					layers: "G6FIA_PA",
					enablePickFeatures: true,
					showEntitiesLabels: true,
					credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
					parameters: {
						transparent: "true",
						format: "image/png"
					}
				}));

			}
			if ($("#carreteresToggle").is(":checked")) {


				//var layersa = viewer.scene.imageryLayers
				layersa.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
					url: URL_carreteres,
					enablePickFeatures: false,
					maximumLevel: 18,
					credit: "Institut Cartogràfic i Geològic de Catalunya"
				}));

			}
			if ($("#allausToggle").is(":checked")) {


				//var layersa = viewer.scene.imageryLayers
				layersa.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
					url: "http://siurana.icgc.cat/geoserver/nivoallaus/wms?",
					layers: "zonesallaus",
					enablePickFeatures: true,
					showEntitiesLabels: true,
					credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
					parameters: {
						transparent: "true",
						format: "image/png"
					}
				}));

			}


		});

	}

	//start controls animacio


	function setupPause() {

		jQuery("#play i").removeClass("circular pause icon");
		jQuery("#play i").addClass("circular play icon");
		animate(false);

	}

	function setupRunning() {

		jQuery("#play i").removeClass("circular play icon");
		jQuery("#play i").addClass("circular pause icon");
		animate();

	}

	function startPlaying() {


		console.info("entro");

		const event = "play";
		let distance = 0;
		let oldCoord = null;
		let desnivellPositiu = 0;
		let desnivellNegatiu = 0;
		let oldElev = null;
		$("#infobox").show();


		
		if (viewer.clock.currentTime.equals(viewer.clock.stopTime) || (event === "play")) {

		
			viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(trackGeoJSON.features[0].properties.coordTimes[0]);

		}

		viewer.clock.onTick.addEventListener((clock) => {

			const actualCoord = trackDataSource.entities.getById("track").position.getValue(clock.currentTime);
			const actualcartoCoord = Cesium.Ellipsoid.WGS84.cartesianToCartographic(actualCoord);
			const actualElev = actualcartoCoord.height;
			


			if (oldCoord && (oldCoord != actualCoord)) {


				const _distance = Cesium.Cartesian3.distance(actualCoord, oldCoord);
				distance += _distance;


				if (oldElev < actualElev) {

					const _desnivellPositiu = actualElev - oldElev;
					desnivellPositiu += _desnivellPositiu;
				

				}

				if (oldElev >= actualElev) {

					const _desnivellNegatiu = actualElev - oldElev;
					desnivellNegatiu += Math.abs(_desnivellNegatiu);

			

				}

				if (distance > 0) {

					$("#distanceLabel").html(`${distance / 1000.0} km`);
					$("#distanceLabel").text(`↦ ${(distance / 1000.0).toFixed(2)} km`);
					$("#desnivellPositiuLabel").text(`↑ ${desnivellPositiu.toFixed(2)} m`);
					$("#desnivellNegatiuLabel").text(`↓ ${desnivellNegatiu.toFixed(2)} m`);
					

				}

			}

			oldCoord = actualCoord;
			oldElev = actualElev;

			// This example uses time offsets from the start to identify which parts need loading.
			const timeOffset = Cesium.JulianDate.secondsDifference(clock.currentTime, clock.startTime);

			//console.log("current-->",clock.currentTime);

			if (labelsDatasource && timeOffset > 1 && timeOffset < 100) {

				endLoading();

			}

			if (viewer.clock.currentTime == viewer.clock.stopTime) {

				console.info("final ruta");


			}


		});


		// fa que e simbol del hiker es mogui
		trackDataSource.entities.getById("track").billboard.show = true;
		viewer.clock.shouldAnimate = true;
		console.log("startvideo-->click");
		initRender();

	}


	function animate(animate = true) {

		console.info("entro start");
		viewer.clock.shouldAnimate = animate;


	}
	capturer = new CanvasRecorder(viewer.scene.canvas);

	function initRender() {

		

		capturer.start();

	}


	function stopRender() {

		capturer.stop();
		

	}

	function saveRender() {

		
		window.open(capturer.save("ruta.webm"));
	

	}

	function endLoading() {

		$("#loading").hide();

	}

	function resetPlay() {

		viewer.clock.shouldAnimate = false;
		viewer.trackedEntity = undefined;
		viewer.trackedEntity = undefined;
		viewer.dataSources.removeAll();


	}

	function enterPauseMode(isInPause) {

		
		if (isInPause) {

			setupPause();

		} else {

			setupRunning();

		}
		

	}


	function vistaInicial() {

		$("#infobox").hide();
		imPro = new Cesium.UrlTemplateImageryProvider({
			url: URL_ORTO,
			enablePickFeatures: false,
			maximumLevel: 18,
			credit: "Institut Cartogràfic i Geològic de Catalunya"
		});

		const layers = viewer.imageryLayers;
		const baseLayer = layers.get(1);
		layers.remove(baseLayer);
		layers.addImageryProvider(imPro);

		camera.flyTo({
			destination: Cesium.Cartesian3.fromDegrees(1.5455, 41.698, 450000),
			duration: 4,
		});


		Cesium.Hash(viewer);

		layers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
			url: URL_carreteres,
			enablePickFeatures: false,
			maximumLevel: 18,
			credit: "Institut Cartogràfic i Geològic de Catalunya"
		}));

		layers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
			url: URL_TOPONIM,
			enablePickFeatures: false,
			maximumLevel: 18,
			credit: "Institut Cartogràfic i Geològic de Catalunya"
		}));
		layers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
			url: URL_carreteres,
			enablePickFeatures: false,
			maximumLevel: 1,
			credit: "Institut Cartogràfic i Geològic de Catalunya"
		}));


		/*
		imPro = new Cesium.UrlTemplateImageryProvider({
			url: URL_carreteres,
			enablePickFeatures: false,
			maximumLevel: 18,
			credit: "Institut Cartogràfic i Geològic de Catalunya"
		});
		var layers = viewer.imageryLayers;
		layers.addImageryProvider(imPro);

		imPro = new Cesium.UrlTemplateImageryProvider({
			url: URL_TOPONIM,
			enablePickFeatures: false,
			maximumLevel: 18,
			credit: "Institut Cartogràfic i Geològic de Catalunya"


		});
		var layers = viewer.imageryLayers;
		layers.addImageryProvider(imPro);

		imPro = new Cesium.UrlTemplateImageryProvider({
			url: URL_carreteres,
			enablePickFeatures: false,
			maximumLevel: 1,
			credit: "Institut Cartogràfic i Geològic de Catalunya"
		});
		var layers = viewer.imageryLayers;
		layers.addImageryProvider(imPro);
		layers.remove(baseLayer);
		//viewer.extend(Cesium.viewerCesiumNavigationMixin, {});*/


	}
	
	//ends controls animacio


}); // end ready
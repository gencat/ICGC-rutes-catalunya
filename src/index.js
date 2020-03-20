// @flow
"use strict";
const fa = require("./utils");
const west = 2.0;
const south = 42.0;
const east = 2.1;
const north = 42.2;
let trackDataSource = null;
let trackDataSourced = null;
let trackGeoJSON = null;
const URL_ORTO = "https://geoserveis.icgc.cat/icc_mapesmultibase/noutm/wmts/orto/GRID3857/{z}/{x}/{y}.jpeg";
const URL_HIBRID = "https://tilemaps.icgc.cat/mapfactory/wmts/hibrida_total/CAT3857/{z}/{x}/{y}.png";
const URL_TOPO =  "https://tilemaps.icgc.cat/mapfactory/wmts/topo_suau/CAT3857/{z}/{x}/{y}.png";
const URL_GEOL = "https://tilemaps.icgc.cat/mapfactory/wmts/geologia/MON3857NW/{z}/{x}/{y}.png";
const URL_RELLEU = "";
let URL_TERRENY = "https://tilemaps.icgc.cat/terrenys/demextes";

var imPro;
var imBase;
const dev = true;
let viewer;



let rutaIniciada = false;
let isInPause = true;
let labelsDatasource;



$(window.document).ready(() => {

	Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(west, south, east, north);

	if (dev) {

		imPro = new Cesium.UrlTemplateImageryProvider({
			url: URL_ORTO,
			enablePickFeatures: false,
			maximumLevel: 18,
			credit: "Institut Cartogràfic i Geològic de Catalunya"
		});
		
		/*imBase = layers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
		url: "http://localhost/mapcache/wmts/?",
		layer: "orto",
		style: "default",
		format: "image/png",
		tileMatrixSetID: "GMTOT",
		maximumLevel: 18,
		credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya")
		}));*/

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

	viewer = new Cesium.Viewer("map", {

		imageryProvider: imPro,
		timeline: false,
		fullscreenElement:true,
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

	let scene = viewer.scene;
	scene.globe.depthTestingAgainstTerrain = true;
	let camera = viewer.scene.camera;
	viewer.scene.globe.enableLighting = true;
	viewer.scene.fog.enabled = true;
	viewer.scene.fog.density = 0.0002;
	viewer.scene.fog.screenSpaceErrorFactor = 2;

	
	vistaInicial();
	initEvents();
	setupLayers();

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

					viewer.entities.add({
						position: Cesium.Cartesian3.fromDegrees(entity.geometry.coordinates[0], entity.geometry.coordinates[1]),
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


	function addToponimsOLd(toponimsGeoJson) {

		if (viewer.dataSources.contains(labelsDatasource)) {

			viewer.dataSources.remove(labelsDatasource);

		}


		labelsDatasource = new Cesium.CustomDataSource("data");
		const promise = Cesium.GeoJsonDataSource.load(`dist/data/rutes/MAP_NAME_${toponimsGeoJson.replace("gpx", "geojson")}`);
		promise.then((dataSource) => {

			const entities = dataSource.entities.values;
			for (let i = 0; i < entities.length; i++) {

				const entity = entities[i];

				const opt = checkOptions(entity["_properties"].Concepte);

				entity.label = {
					text: entity["_properties"].Toponim,
					font: opt.font,
					fillColor: opt.color,
					outlineColor: Cesium.Color.BLACK,
					outlineWidth: 4,
					distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, opt.far),

					style: Cesium.LabelStyle.FILL_AND_OUTLINE,
					pixelOffset: new Cesium.Cartesian2(0, -9),
					heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
				};

				entity.billboard = undefined;
				if (entity.label) {


					labelsDatasource.entities.add(entity);

				}

			}


		});

	}

	function initEvents() {




		$("#selectRutes").on("change", function () {

			if (this.value != null) {

				resetPlay();
				$("#controls").show();
				$("#pausa").hide();
				$("#loading").hide();
				showEntitiesLabels(false);
				rutaIniciada = false;
				loadGPX(this.value);

			}

		});
		

		jQuery("#menuIcon").on("click", () => {


	//		$("#sideBarOptions").sidebar("toggle");


			$("#sideBarOptions").first()
			.sidebar("toggle");

			$("toggle")
			.removeClass('disabled')
;

		});
	
	

		jQuery("#play").on("click", () => {
			
			if (rutaIniciada){
				//canvia valor al contrari. SI està en pausa (false), al fer clic canvia a noPausa(true) i al reves. 
				//De manera que si està en pause(false), l enterPauseMode serà false i llavors animarà.
				//Si està en play(NoPause, true), el enterPause mode serà true i llavors pausarà.
				
				isInPause = !isInPause
				enterPauseMode(isInPause);

			//Si no està en pausa ni està en play farà el ELSE (que es començar l'animació desde el principi (startPlaying))
			}else{
				showEntitiesLabels(true);

					jQuery("#loading").show(1000, (e) => {
	
						rutaIniciada = true;
						console.log("comença")
						startPlaying();
						$("#loading").hide();
						jQuery("#play i").removeClass("circular play icon");
    					jQuery("#play i").addClass("circular pause icon")
	
					});
					isInPause = false
			}
		
		});


		/*$("#pausa").on("click", () => {

			// console.info("pausa");
			if (rutaIniciada) {

				enterPauseMode(true);

			}

		});*/

		$("#playpausa").on("click", () => {

			//console.info("playpausa");
			enterPauseMode(false);
			$("#pausa").show();
			$("#loading").hide();
			//  $("#playpausa").hide();
			$("#play").hide();

		});

		$("#home").on("click", () => {

			if (rutaIniciada) {

				initAnimation();
				jQuery("#play i").removeClass("circular play icon");
				jQuery("#play i").addClass("circular pause icon");
				

			}

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
				console.log("search")
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

	}

	let gpxDataSource;

	function loadGPX(gpx) {

		/*jQuery("#menuSearch").addClass("vermell");*/

		// const id1 = gpx.split("_");
		// const id = id1[0].startsWith("00") ? id1[0].substring(2, id1[0].length) : id1[0].substring(1, id1[0].length);
		const ruta = `dist/data/rutes/${gpx}`;
		const rutaStatic = `dist/data/rutes/${gpx}`;

		const lGPX = omnivore.gpx(ruta, null).on("ready", function (data) {


			if (viewer.dataSources.contains(gpxDataSource)) {

				viewer.dataSources.remove(gpxDataSource);

			}

			gpxDataSource = new Cesium.CzmlDataSource();

			const fly = true;
			trackGeoJSON = { type: "FeatureCollection", features: [] };
			trackGeoJSON.features.push(fa.tmUtils.extractSingleLineString(this.toGeoJSON()));


			viewer.dataSources.add(gpxDataSource.load(fa.tmUtils.buildCZMLForTrack(trackGeoJSON, lGPX, "marker"))).then((ds) => {
// trackDataSource segueix el track amb animació
				trackDataSource = ds;
				


				if (fly) {


					viewer.flyTo(ds, { duration: 2,	});

					addToponims(gpx);

				} else {

					console.info("faig zoom");

					viewer.zoomTo(ds);

				}
				viewer.clock.shouldAnimate = false;


				//const autoPlay = true;
				//setUp3DTrackControls (trackGeoJSON, autoPlay);
				// var trailHeadHeight = trackGeoJSON.features[0].geometry.coordinates[0][2];
				// setUp3DZoomControls(trailHeadHeight);
				//addToponims(gpx);

			});


		});

	}


	function setupLayers(){
		
	
		$("#topograficMenu").on("click", () => {
			console.log("entrotopo")
			imPro = new Cesium.UrlTemplateImageryProvider({
				url: URL_TOPO,
				enablePickFeatures: false,
				maximumLevel: 18,
				credit: "Institut Cartogràfic i Geològic de Catalunya"
			})
			
			var layers = viewer.imageryLayers;
			var baseLayer = layers.get(0);
			layers.remove(baseLayer);
			layers.addImageryProvider(imPro);
			
			
		})

		$("#ortofotoMenu").on("click", () => {
			console.log("entroorto")
			imPro = new Cesium.UrlTemplateImageryProvider({
				url: URL_ORTO,
				enablePickFeatures: false,
				maximumLevel: 18,
				credit: "Institut Cartogràfic i Geològic de Catalunya"
			})
			
			var layers = viewer.imageryLayers;
			var baseLayer = layers.get(0);
			layers.remove(baseLayer);
			layers.addImageryProvider(imPro);
			
		})
		$("#hibridMenu").on("click", () => {
			console.log("entrohibrid")
	
			imPro = new Cesium.UrlTemplateImageryProvider({
				url: URL_HIBRID,
				enablePickFeatures: false,
				maximumLevel: 18,
				credit: "Institut Cartogràfic i Geològic de Catalunya"
			})
			
			var layers = viewer.imageryLayers;
			var baseLayer = layers.get(1);
			layers.remove(baseLayer);
			layers.addImageryProvider(imPro);
			
		})
		$("#relleuMenu").on("click", () => {
			console.log("entrorelleu")
			imPro = new Cesium.UrlTemplateImageryProvider({
				url: URL_RELLEU,
				enablePickFeatures: false,
				maximumLevel: 18,
				credit: "Institut Cartogràfic i Geològic de Catalunya"
			})
			
			var layers = viewer.imageryLayers;
			var baseLayer = layers.get(0);
			layers.remove(baseLayer);
			layers.addImageryProvider(imPro);
			
		})
		$("#geologicMenu").on("click", () => {
			console.log("entrogeo")
			imPro = new Cesium.UrlTemplateImageryProvider({
				url: URL_GEOL,
				enablePickFeatures: false,
				maximumLevel: 18,
				credit: "Institut Cartogràfic i Geològic de Catalunya"
			})
			
			var layers = viewer.imageryLayers;
			var baseLayer = layers.get(0);
			layers.remove(baseLayer);
			layers.addImageryProvider(imPro);
			
		})


}
	
	function setupPause(){
		
		jQuery("#play i").removeClass("circular pause icon")
    	jQuery("#play i").addClass("circular play icon")
		animate(false);
	
	}

	function setupRunning(){

		jQuery("#play i").removeClass("circular play icon")
    	jQuery("#play i").addClass("circular pause icon")
		animate();
		
	}

	function startPlaying() {


		console.info("entro");

		//$("#playicon").addClass("loading");
		//FIXME SAME VALUE ALWAYS
		const event = "play";
		

		if (viewer.clock.currentTime.equals(viewer.clock.stopTime) || (event === "play")) {
			//Resetea la ruta
			viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(trackGeoJSON.features[0].properties.coordTimes[0]);
		}

		
		viewer.trackedEntity = trackDataSource.entities.getById("track");
		
		/*viewer.trackedEntity = trackDataSourced.entities.getById("track");*/

		// fa que e simbol del hiker es mogui
		trackDataSource.entities.getById("track").billboard.show = true;
		/*trackDataSourced.entities.getById("track").billboard.show = true;*/
		viewer.clock.shouldAnimate = true;


	}

	function animate(animate = true){
		viewer.clock.shouldAnimate = animate;
	}

	function endLoading() {

		// console.info("endLoading");
		$("#loading").hide();
		//$("#playpausa").hide();
		// $("#play").hide();
		// $("#pausa").show();

	}


	function resetPlay() {

		viewer.clock.shouldAnimate = false;
		viewer.trackedEntity = undefined;
		viewer.trackedEntity = undefined;
		//trackDataSource.entities.getById('track').billboard.show = false;
		//readyToPlayButtonState();
		//viewer.clock.onTick.removeEventListener(clockTracker);

	}

	function initAnimation() {

		isInPause = false
		viewer.clock.currentTime = viewer.clock.startTime;
		viewer.clock.shouldAnimate = true;

	}

	function enterPauseMode(isInPause) {

		//viewer.clock.onTick.removeEventListener(clockTracker);
		if (isInPause){
			setupPause()
		} else {
			setupRunning()
		}
		//viewer.clock.shouldAnimate = !isInPause;
		//pausedButtonState();

	}

	function vistaInicial() {


		camera.flyTo({
			destination: Cesium.Cartesian3.fromDegrees(1.5455, 41.698, 450000),
			duration: 4,
		});


		Cesium.Hash(viewer);

	}
	function vistaInicialPro() {

		camera.flyTo({
			destination: Cesium.Cartesian3.fromDegrees(3.354784, 35.288017, 15202342),
			duration: 0,
			complete: function () {

				setTimeout(() => {

					camera.flyTo({
						destination: Cesium.Cartesian3.fromDegrees(1.5455, 41.698, 450000),
						orientation: {
							heading: Cesium.Math.toRadians(360),
							pitch: Cesium.Math.toRadians(-90.0), //tilt
						},
						easingFunction: Cesium.EasingFunction.LINEAR_NONE
					});
					// addToponims();

				}, 1000);


			}
		});

		Cesium.Hash(viewer);
		viewer.clock.onTick.addEventListener((clock) => {

			// This example uses time offsets from the start to identify which parts need loading.
			const timeOffset = Cesium.JulianDate.secondsDifference(clock.currentTime, clock.startTime);

			//console.info("timeOffset",timeOffset);

			if (labelsDatasource && timeOffset > 1 && timeOffset < 100) {

				endLoading();

			}

			if (viewer.clock.currentTime == viewer.clock.stopTime) {

				console.info("final ruta");

			}

		});


	}


	async function enviarPeticio(url) {

		console.warn(url);

		return fetch(url)
			.then((response) => {

				return response.json();

			})
			.then((data) => {

				console.warn("Respuesta", data);
				return data;

			}).catch((error) => {

				console.warn("Error", error);
				alert("Error peticion");
				return null;

			});

	}


}); // end ready

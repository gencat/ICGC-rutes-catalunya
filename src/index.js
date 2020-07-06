// @flow


"use strict";
const ev = require("./events.js");
const ut = require("./utils.js");
const fn = require("./functions.js");
const ly = require("./layers.js");
const west = 2.0;
const south = 42.0;
const east = 2.1;
const north = 42.2;
let trackDataSource = null;
let trackGeoJSON = null;
let CAPA_ALLAUS = null;
let CAPA_TOPONIMS = null;
let CAPA_RISCGEOLOGIC = null;
let CAPA_CARRETERS = null;
let CAPA_CIMS = null;

let caixaCerca;
const MAPSTATE = {
	"base": ly.BaseMaps.orto,
	"gpx": null,
	"description": null,
	"title": null,
	"meta": null,
	"layers": null
};
let fakeMap;
let controlElevation;
let imPro;
const urlApp = "http://localhost:9966"; //"https://betaserver.icgc.cat/rutes-catalunya/"
const dev = true;
let viewer;
let rutaIniciada = false;

let isInPause = true;
let labelsDatasource;
let capturer;
const baseParam = $.url().param("base");
const gpxParam = $.url().param("gpx");
const layersParam = $.url().param("layers");
const coordsParam = $.url().param("coords");


$(window.document).ready(() => {


	ev.htmlEvents.dropDownBT();

	Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(west, south, east, north);

	Cesium.Resource.supportsImageBitmapOptions = function () {

		return Cesium.when.resolve(false);

	};

	viewer = new Cesium.Viewer("map", {
		imageryProvider: ly.LayerOrtoEsri,
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
		vrButton: false,
		showRenderLoopErrors: false,
		useDefaultRenderLoop: true,
		orderIndependentTranslucency: true,
		sceneMode: Cesium.SceneMode.SCENE3D,
		terrainProvider: ly.LayerTerrenyICGC
	});

	const scene = viewer.scene;
	const camera = viewer.scene.camera;
	const ImageryLayers = viewer.scene.imageryLayers;
	ImageryLayers.addImageryProvider(ly.LayerOrtoICGC);
	ly.LayerTerrenyICGC.errorEvent.addEventListener((tileProviderError) => {

	
		tileProviderError.retry = false;

	});


	viewer.scene.logarithmicDepthBuffer = false;
	scene.globe.depthTestingAgainstTerrain = true;
	viewer.scene.globe.enableLighting = true;
	viewer.scene.fog.enabled = true;
	viewer.scene.fog.density = 0.0002;
	viewer.scene.fog.screenSpaceErrorFactor = 2;

	initEvents();

	initElevation();
	vistaInicial();
	setupLayers();

	//


	function showEntitiesLabels(value) {

		if (labelsDatasource) {

			labelsDatasource.show = value;
			return true;

		}

	}


	function addToponims() {

		const toponimsGeoJson = MAPSTATE.gpx;

		viewer.entities.removeAll();

		jQuery.getJSON(`dist/data/rutes/MAP_NAME_${toponimsGeoJson.replace("gpx", "geojson")}`, (respuestaGeonames) => {

			for (let i = 0; i < respuestaGeonames.features.length; i++) {

				if (respuestaGeonames.features[i].properties.Concepte !== "edif.") {

					const entity = respuestaGeonames.features[i];

					const opt = fn.rutes.checkOptions(entity.properties.Concepte);
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


				} 

				if (i == (respuestaGeonames.features.length - 1)) {


					jQuery("#menuSearch").removeClass("vermell");

				}

			}


		});
		


	}


	function initElevation() {

		const elevationOptions = {
			theme: "lightblue-theme",
			detached: true,
			elevationDiv: "#elevation-div",
			width: jQuery("#elevation-div").outerWidth(),
			height: "150",
			autohide: false,
			collapsed: true,
			position: "bottom",
			followMarker: false,
			imperial: false,
			reverseCoords: false,
			summary: "multiline",

		};

		fakeMap = new L.Map("fakemap");
		controlElevation = L.control.elevation(elevationOptions).addTo(fakeMap);


	}

	function sendRequest(result) {

		resetPlay();
		$("#controls").show();
		$("#pausa").hide();
		$("#loading").hide();

		showEntitiesLabels(false);
		rutaIniciada = false;
		MAPSTATE.gpx = result.id;
		MAPSTATE.title = result.title;
		MAPSTATE.description = result.description;
		loadGPX(result.id, false);
	

	}


	function initEvents() {


		FileReaderJS.setupInput(document.getElementById("uploadbutton"),

		{
			readAsDefault: "DataURL",
			on: {
			  load: function(e, file) {

					const ruta = file;
					const gpx = $(ruta).attr("name");
					

					if (ruta != null) {

						$("#controls").show();
						$("#pausa").hide();
						$("#loading").hide();
						$("#prompt").hide();
						showEntitiesLabels(false);
						rutaIniciada = false;

						$("#uploadButton").prop("name", ruta);
						viewer.dataSources.removeAll();
						MAPSTATE.gpx = ruta;
						MAPSTATE.title = ruta;
						MAPSTATE.description = "";
						loadGPX(gpx, true, e.target.result);
						

					}

				}
			}

		}
		);

		
		$("#selectRutes").on("change", function () {

			if (this.value != null) {


				$("#controls").show();
				$("#pausa").hide();
				$("#loading").hide();
				showEntitiesLabels(false);
				rutaIniciada = false;
				loadGPX(this.value, false);
				$("#elevationbutton").load(this.value);

			}

		});


		jQuery("#play").on("click", () => {

			ev.htmlEvents.collapseSidePanel();
			jQuery("#savevideobutton").css("opacity", 1);
			
			jQuery("#savevideobutton").attr("title", "Descarrega video de l'animació");

			if (rutaIniciada) {

				isInPause = !isInPause;
				enterPauseMode(isInPause);

			} else {

				showEntitiesLabels(true);

				jQuery("#loading").show(1000, (e) => {

					rutaIniciada = true;

					
					startPlaying();
					$("#loading").hide();
					jQuery("#play i").removeClass("circular play icon");
					jQuery("#play i").addClass("circular pause icon");


				});
				isInPause = false;

			}

		});

		ev.htmlEvents.toolBarAnimation();


		$("#playpausa").on("click", () => {

			enterPauseMode(false);
			$("#pausa").show();
			$("#loading").hide();
			$("#play").hide();

		});


		$("#stopvideobutton").on("click", () => {

			stopRender();


		});
		$("#savevideobutton").on("click", () => {

			console.info($("#savevideobutton").css("opacity"));
			if ($("#savevideobutton").css("opacity") == 1) {

				stopRender();
				saveRender();

			}

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

		$("#closeSearch").on("click", () => {

			setupPause();

			if (viewer.dataSources.contains(gpxDataSource)) {

				viewer.dataSources.removeAll();

			}

			$("#infobox").hide();
			$("#controls").hide();
			$("#closeSearch").hide();
			$("#lupaSearch").show();
			$("#textSearch").val("");
			ev.htmlEvents.sidePanelStatus(false);
			MAPSTATE.gpx = null;
			$(".ui.search").search("setting", { maxResults: 7 });
			jQuery("#savevideobutton").css("opacity", 0.5);
			
			jQuery("#savevideobutton").attr("title", "Inicia l'animació per poder descarregar el video");

		});

		caixaCerca = $(".ui.search")
			.search({
				source: rutesJSON,
				minCharacters: 2,
				searchFields: [
					"title",
					"description",
					"id"
				],
				maxResults: 0,
			
				fullTextSearch: "exact",
				onResults:function(response) {

					
					if (response.results.length === 1) {

						sendRequest(response.results[0]);

					}

				},
				onSelect: function (result) {

					
					if (result.id != null) {

						sendRequest(result);


					}

				}
			})
		;


		$("#cimsToggle").change(function () {

			

			if ($(this).is(":checked")) {

				CAPA_CIMS = CAPA_CIMS ? CAPA_CIMS : ImageryLayers.addImageryProvider(ly.LayerCimsICGC);
				CAPA_CIMS.show = true;
				

			} else {

				CAPA_CIMS.show = false;

			}

		});

		$("#allausToggle").change(function (id) {

			

			if ($(this).is(":checked")) {

				CAPA_ALLAUS = CAPA_ALLAUS ? CAPA_ALLAUS : ImageryLayers.addImageryProvider(ly.LayersAllausICGC);
				CAPA_ALLAUS.show = true;
				
			} else {

				CAPA_ALLAUS.show = false;

			}

		});

		$("#toponimsToggle").change(function () {

			

			if ($(this).is(":checked")) {

				CAPA_TOPONIMS = CAPA_TOPONIMS ? CAPA_TOPONIMS : ImageryLayers.addImageryProvider(ly.LayerToponimsICGC);
				CAPA_TOPONIMS.show = true;

			} else {

				CAPA_TOPONIMS.show = false;

			}


		});


		$("#landslidesToggle").change(function () {

			

			if ($(this).is(":checked")) {

				CAPA_RISCGEOLOGIC = CAPA_RISCGEOLOGIC ? CAPA_RISCGEOLOGIC : ImageryLayers.addImageryProvider(ly.LayerRiscGeologicICGC);
				CAPA_RISCGEOLOGIC.show = true;

			} else {

				CAPA_RISCGEOLOGIC.show = false;

			}


		});

		$("#carreteresToggle").change(function () {

			
			if ($(this).is(":checked")) {

				CAPA_CARRETERS = CAPA_CARRETERS ? CAPA_CARRETERS : ImageryLayers.addImageryProvider(ly.LayerCarreteresICGC);
				CAPA_CARRETERS.show = true;

			} else {

				CAPA_CARRETERS.show = false;

			}


		});

		// GEOLOCATION
		$("#gpslocation").on("click", () => {
	
		
		var x = document.getElementById("gpslocation");
		
		  if (navigator.geolocation) {
			  
			navigator.geolocation.getCurrentPosition(showPosition);
		  } else {
			x.innerHTML = "Geolocation is not supported by this browser.";
		  }
	
		function showPosition(position) {
		
		 
			
		 camera.flyTo({
			 destination: Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude,   2000),
			 duration:0
		 });	

		 
				
		 viewer.entities.add({
			  position: Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude),
			  billboard: {
				image: "../dist/css/img/room-24px.svg",
				scale: 1.50,
				color: new Cesium.Color(30.0, 97.0, 148.0, 1.0)
			  },
		
		
			});

			


		
		
	}


	});

		//ENLLACA
		$(".enllaca").on("click", () => {

				const currentURLRaw = window.location.href.valueOf();
			const splitUrl = currentURLRaw.split("#");
			
			const gpxidd = MAPSTATE.gpx 

			if (typeof gpxidd === 'string' || gpxidd instanceof String){
			
			var gpxid = gpxidd ? gpxidd.replace(".gpx", "") : ''
			}
			else{
			
			var gpxid = '';

			}
			
			

			const currentURL = `${splitUrl[0]}?base=${MAPSTATE.base}&gpx=${gpxid}&layers=${MAPSTATE.layers}&#${splitUrl[1]}`;

			$("#urlMap").val(encodeURI(currentURL.valueOf()));

			const iframecode = `<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="${currentURL.replace("#", "\\#")}" ></iframe>`;

			$("#iframeMap").html(iframecode);

			$("#enllacamodal").modal("show");

		});
	

	}


	let gpxDataSource;

	function loadGPX(gpx, gpxLocal, file) {

		const ruta = gpxLocal ? file : `dist/data/rutes/${gpx}`;

		const lGPX = omnivore.gpx(ruta, null).on("ready", function (data) {

			$(".ui.button.fileRequest").attr("data-gpx", ruta);
			$(".ui.button.fileRequest").attr("href", ruta);
			$(".enllaca").prop("name", ruta);

			$("#uploadButton").prop("name", ruta);
			$("#elevationbutton").prop("elevation", trackGeoJSON);

			$("#infobox").hide();
			$("#elevation-div").hide();
			$("#elevation-div").removeData(trackGeoJSON);

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
			
			const fly = true;

			trackGeoJSON = { type: "FeatureCollection", features: [] };


			trackGeoJSON.features.push(ut.tmUtils.extractSingleLineString(this.toGeoJSON()));


			//track base prim//
			viewer.dataSources.add(Cesium.GeoJsonDataSource.load(trackGeoJSON, {
				stroke: Cesium.Color.RED,
				fill: Cesium.Color.BURLYWOOD,
				strokeWidth: 1,
				markerSymbol: "?"
			}));
			// fi track base prim
			heCercat(trackGeoJSON, controlElevation, MAPSTATE);

			viewer.dataSources.add(gpxDataSource.load(ut.tmUtils.buildCZMLForTrack(trackGeoJSON, lGPX, "marker"))).then((ds) => {

				trackDataSource = ds;

				ev.htmlEvents.openSidePanel();
				if (fly) {

					viewer.flyTo(ds, { duration: 2 });

					setTimeout(() => {

						const _base = MAPSTATE.base;
						if (_base.indexOf("orto") !== -1) {

							

						}

					}, 2000);


				} else {


					viewer.zoomTo(ds);

				}
				viewer.clock.shouldAnimate = false;


			});


		});

	}


	function heCercat(trackGeoJSON, controlElevation, MAPSTATE) {

		fn.rutes.addTemplateInfoElevation(trackGeoJSON, controlElevation, MAPSTATE);
		$("#closeSearch").show();
		$("#lupaSearch").hide();
		$("#resultsCerca").removeClass("visible");
		$("#resultsCerca").addClass("hidden");
		$("#resultsCerca").hide();


	}

	function setupLayers() {

		$("#iniciaHome").on("click", () => {

			ev.htmlEvents.toggleSideBar();

		});


		$("#baseLayers a").on("click", (e) => {

			changeBaseLayers(e.target.id);


		});


	}

	//start controls animacio

	function changeBaseLayers(id) {

		$("#baseLayers a").removeClass("active");
		ly.fnLayers.removeBaseLayers(ImageryLayers, 2);
		ly.fnLayers.addBaseLayers(ImageryLayers, id);
		$(`#${e.target.id}`).addClass("active");

		ev.htmlEvents.toggleSideBar();
		MAPSTATE.base = id;


	}


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

	
			const timeOffset = Cesium.JulianDate.secondsDifference(clock.currentTime, clock.startTime);



			if (labelsDatasource && timeOffset > 1 && timeOffset < 100) {

				endLoading();

			}

			if (viewer.clock.currentTime === viewer.clock.stopTime) {

				


			}


		});


	
		viewer.trackedEntity = trackDataSource.entities.getById("track");
		trackDataSource.entities.getById("track").billboard.show = true;
		viewer.clock.shouldAnimate = true;
		
		initRender();

	}


	function animate(animate = true) {

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


	function checkURLParameters() {


		//http://127.0.0.1:5500/index.html?base=ortofotoMenu&gpx=null&layers=null&#42.211228/1.698078/5500/360/-53

		if (baseParam && baseParam !== "" && baseParam !== ly.BaseMaps.orto) {

			changeBaseLayers(baseParam);

		}

		if (gpxParam && gpxParam !== "" !==null) {

			
			$("#textSearch").focus();
			$("#textSearch").val(gpxParam);

			$(".ui.search").search("setting", { maxResults: 0 });
			$(".ui.search").search("query", gpxParam);

		} else {

			$(".ui.search").search("setting", { maxResults: 7 });

		}

		if (layersParam) {

			//falta
		

		}

		// if (coordsParam){
			
		// }

	}


	function vistaInicial() {


		checkURLParameters();
	


		camera.flyTo({
			destination: Cesium.Cartesian3.fromDegrees(1.698078, 42.211228, 450000),
			duration: 0,
			complete: function () {

				setTimeout(() => {

					camera.flyTo({
						destination: Cesium.Cartesian3.fromDegrees(1.743685, 42.225577, 3121),
						orientation: {
							heading: Cesium.Math.toRadians(295),
							pitch: Cesium.Math.toRadians(-22), //tilt
						},
						easingFunction: Cesium.EasingFunction.LINEAR_NONE
					});
					//

				}, 1000);


			}
		});

		Cesium.Hash(viewer);


	}

	//ends controls animacio


}); // end ready

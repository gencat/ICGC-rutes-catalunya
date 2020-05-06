(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// @flow
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.htmlEvents = void 0;

var htmlEvents = function () {
  var dropDownBT = function dropDownBT() {
    $(".ui.fluid.dropdown").dropdown({
      maxSelections: 3
    });
    $(".label.ui.dropdown").dropdown();
    $(".no.label.ui.dropdown").dropdown({
      useLabels: false
    });
    $(".ui.button").on("click", function () {
      $(".ui.dropdown").dropdown("restore defaults");
    });
    $(".ui.button.fileRequest").click(function () {
      var ruta = $(this).attr("data-gpx");
      console.log("onDownload");
      window.location = ruta;
    });
    $("#infobox").hide();
    jQuery("#menuIcon").on("click", function () {
      toggleSideBar();
      $("toggle").removeClass("disabled");
    });
    $(".headerInfo").on("click", function () {
      console.info("modal");
      $(".ui.modal.info").modal("show");
      console.info("modal entra");
    });
    $("#infoallausid").on("click", function () {
      console.info("modal");
      $(".ui.modal.allaus").modal("show");
      console.info("modal entra");
    });
    $("#infolandslidesid").on("click", function () {
      console.info("modal");
      $(".ui.modal.esllavissades").modal("show");
      console.info("modal entra");
    });
    return true;
  };

  var toggleSideBar = function toggleSideBar() {
    $("#sideBarOptions").sidebar("setting", "transition", "overlay").sidebar("toggle");
  };

  var toolBarAnimation = function toolBarAnimation() {
    $("sideBt").on("click", function () {
      console.info($("#mySidepanel").width);
      document.getElementById("mySidepanel").style.width = "250px";
    });
  };

  return {
    dropDownBT: dropDownBT,
    toggleSideBar: toggleSideBar,
    toolBarAnimation: toolBarAnimation
  };
}();

exports.htmlEvents = htmlEvents;

},{}],2:[function(require,module,exports){
// @flow
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rutes = void 0;

var rutes = function () {
  var checkOptions = function checkOptions(concepte) {
    var opt = {
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
      opt.color = Cesium.Color.PALEGREEN, opt.font = "12px Helvetica";
      opt.far = 5000;
    }

    if (concepte == "cim") {
      opt.color = Cesium.Color.SPRINGGREEN, opt.font = "13px Helvetica";
      opt.far = 6000;
    }

    return opt;
  };

  return {
    checkOptions: checkOptions
  };
}();

exports.rutes = rutes;

},{}],3:[function(require,module,exports){
// @flow
"use strict";

var ev = require("./events.js");

var ut = require("./utils.js");

var fn = require("./functions.js");

var ly = require("./layers.js");

var west = 2.0;
var south = 42.0;
var east = 2.1;
var north = 42.2;
var trackDataSource = null;
var trackGeoJSON = null;
var CAPA_ALLAUS = null;
var CAPA_TOPONIMS = null;
var CAPA_RISCGEOLOGIC = null;
var CAPA_CARRETERS = null;
var CAPA_CIMS = null;
var MAPSTATE = {
  "base": ly.BaseMaps.orto,
  "gpx": null,
  "layers": null
};
var fakeMap;
var controlElevation;
var imPro;
var urlApp = "http://localhost:9966"; //"https://betaserver.icgc.cat/rutes-catalunya/"

var dev = true;
var viewer;
var rutaIniciada = false;
var isInPause = true;
var labelsDatasource;
var capturer;
$(window.document).ready(function () {
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
  var scene = viewer.scene;
  var camera = viewer.scene.camera;
  var ImageryLayers = viewer.scene.imageryLayers;
  ImageryLayers.addImageryProvider(ly.LayerOrtoICGC);
  ly.LayerTerrenyICGC.errorEvent.addEventListener(function (tileProviderError) {
    //console.log(`Error at level : ${tileProviderError.level}`);
    tileProviderError.retry = false;
  });
  viewer.scene.logarithmicDepthBuffer = false;
  scene.globe.depthTestingAgainstTerrain = true;
  viewer.scene.globe.enableLighting = true;
  viewer.scene.fog.enabled = true;
  viewer.scene.fog.density = 0.0002;
  viewer.scene.fog.screenSpaceErrorFactor = 2;
  vistaInicial();
  initElevation();
  initEvents();
  setupLayers(); //

  function showEntitiesLabels(value) {
    if (labelsDatasource) {
      labelsDatasource.show = value;
      return true;
    }
  }

  function addToponims(toponimsGeoJson) {
    viewer.entities.removeAll();
    jQuery.getJSON("dist/data/rutes/MAP_NAME_".concat(toponimsGeoJson.replace("gpx", "geojson")), function (respuestaGeonames) {
      for (var i = 0; i < respuestaGeonames.features.length; i++) {
        if (respuestaGeonames.features[i].properties.Concepte != "edif.") {
          var entity = respuestaGeonames.features[i];
          var opt = fn.rutes.checkOptions(entity.properties.Concepte); //console.log('prop', entity.properties)

          var entityG = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(entity.geometry.coordinates[0], entity.geometry.coordinates[1], entity.geometry.coordinates[2]),
            label: {
              text: entity.properties.Toponim,
              font: opt.font,
              fillColor: opt.color,
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 4,
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, opt.far),
              //forceUpdate:true,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              pixelOffset: new Cesium.Cartesian2(0, -9),
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
          });
          entityG.label.manualUpdate = true;
          entityG.label.forceUpdate = true;
        } // en if
        //console.info(i,respuestaGeonames.features.length - 1 );


        if (i == respuestaGeonames.features.length - 1) {
          jQuery("#menuSearch").removeClass("vermell");
        }
      } //en for label

    }); //end then
  }

  function initElevation() {
    var elevationOptions = {
      theme: "custom-theme",
      detached: true,
      elevationDiv: "#elevation-div",
      width: jQuery("#elevation-div").outerWidth(),
      autohide: false,
      collapsed: true,
      position: "bottom",
      followMarker: false,
      imperial: false,
      reverseCoords: false,
      summary: "multiline"
    };
    fakeMap = new L.Map("fakemap");
    controlElevation = L.control.elevation(elevationOptions).addTo(fakeMap);
  }

  function initEvents() {
    $("#uploadbutton").on("change", function () {
      console.log("onUpload");
      var ruta = document.getElementById("uploadbutton").files[0];
      var gpx = $(ruta).attr("name");
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
        $("#elevationbutton").load(this.value);
      }
    });
    jQuery("#play").on("click", function () {
      if (rutaIniciada) {
        isInPause = !isInPause;
        enterPauseMode(isInPause);
      } else {
        showEntitiesLabels(true);
        jQuery("#loading").show(1000, function (e) {
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
    ev.htmlEvents.toolBarAnimation();
    $("#playpausa").on("click", function () {
      enterPauseMode(false);
      $("#pausa").show();
      $("#loading").hide();
      $("#play").hide();
    });
    $("#stopvideobutton").on("click", function () {
      stopRender();
    });
    $("#savevideobutton").on("click", function () {
      console.log("savevideo-->click");
      saveRender();
    });
    $("#home").on("click", function () {
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
    $("#erasefilebutton").on("click", function () {
      setupPause();

      if (viewer.dataSources.contains(gpxDataSource)) {
        viewer.dataSources.removeAll();
      }

      $("#infobox").hide();
    });
    $(".ui.search").search({
      source: rutesJSON,
      minCharacters: 2,
      searchFields: ["title", "description"],
      maxResults: 7,
      fullTextSearch: "exact",
      onSelect: function onSelect(result) {
        console.log("search");

        if (result.id != null) {
          resetPlay();
          $("#controls").show();
          $("#pausa").hide();
          $("#loading").hide(); //showEntitiesLabels(false);

          rutaIniciada = false;
          loadGPX(result.id);
        }
      }
    });
    $("#cimsToggle").change(function () {
      console.log("cimsToggle");

      if ($(this).is(":checked")) {
        CAPA_CIMS = CAPA_CIMS ? CAPA_CIMS : ImageryLayers.addImageryProvider(ly.LayerCimsICGC);
        CAPA_CIMS.show = true;
      } else {
        CAPA_CIMS.show = false;
      }
    });
    $("#allausToggle").change(function () {
      console.log("allausToggle");

      if ($(this).is(":checked")) {
        CAPA_ALLAUS = CAPA_ALLAUS ? CAPA_ALLAUS : ImageryLayers.addImageryProvider(ly.LayerAllausICGC);
        CAPA_ALLAUS.show = true;
      } else {
        CAPA_ALLAUS.show = false;
      }
    });
    $("#toponimsToggle").change(function () {
      console.log("toponimsToggle");

      if ($(this).is(":checked")) {
        CAPA_TOPONIMS = CAPA_TOPONIMS ? CAPA_TOPONIMS : ImageryLayers.addImageryProvider(ly.LayerToponimsICGC);
        CAPA_TOPONIMS.show = true;
      } else {
        CAPA_TOPONIMS.show = false;
      }
    });
    $("#landslidesToggle").change(function () {
      console.log("landslidesToggle");

      if ($(this).is(":checked")) {
        CAPA_RISCGEOLOGIC = CAPA_RISCGEOLOGIC ? CAPA_RISCGEOLOGIC : ImageryLayers.addImageryProvider(ly.LayerRiscGeologicICGC);
        CAPA_RISCGEOLOGIC.show = true;
      } else {
        CAPA_RISCGEOLOGIC.show = false;
      }
    });
    $("#carreteresToggle").change(function () {
      console.log("carreteresToggle");

      if ($(this).is(":checked")) {
        CAPA_CARRETERS = CAPA_CARRETERS ? CAPA_CARRETERS : ImageryLayers.addImageryProvider(ly.LayerCarreteresICGC);
        CAPA_CARRETERS.show = true;
      } else {
        CAPA_CARRETERS.show = false;
      }
    });
    $("#elevationbutton").on("click", function () {
      console.info(trackGeoJSON);
      $("#elevation-div").toggle();
      controlElevation.clear();
      controlElevation.load(trackGeoJSON);
      console.info(controlElevation);
      var q = document.querySelector.bind(document);
      var track = controlElevation.track_info;
      console.info(controlElevation.track_info);
      q('.totlen .summaryvalue').innerHTML = track.distance.toFixed(2) + " km";
      q('.maxele .summaryvalue').innerHTML = track.elevation_max.toFixed(2) + " m";
      q('.minele .summaryvalue').innerHTML = track.elevation_min.toFixed(2) + " m";
    }); //ENLLACA

    $(".enllaca").on("click", function () {
      console.info("hola enllaca");
      var currentURLRaw = window.location.href.valueOf();
      var splitUrl = currentURLRaw.split("#");
      var currentURL = "".concat(splitUrl[0], "?base=").concat(MAPSTATE.base, "&gpx=").concat(MAPSTATE.gpx, "&layers=").concat(MAPSTATE.layers, "&#").concat(splitUrl[1]);
      $("#urlMap").val(encodeURI(currentURL.valueOf()));
      var iframecode = "<iframe width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" src=\"".concat(currentURL.replace("#", "\\#"), "\" ></iframe>");
      $("#iframeMap").html(iframecode);
      $("#enllacamodal").modal("show");
    }); //ENLLACA
  }

  var gpxDataSource;

  function loadGPX(gpx) {
    var ruta = "dist/data/rutes/".concat(gpx);
    MAPSTATE.gpx = gpx;
    var lGPX = omnivore.gpx(ruta, null).on("ready", function (data) {
      $(".ui.button.fileRequest").attr("data-gpx", ruta);
      $(".ui.button.fileRequest").attr("href", ruta);
      $(".enllaca").prop("name", ruta);
      $("#uploadButton").prop("name", ruta);
      $("#elevationbutton").prop("elevation", trackGeoJSON);
      $("#infobox").hide();
      $("#elevation-div").hide();
      $("#elevation-div").removeData(trackGeoJSON); //similar

      if (viewer.dataSources.contains(gpxDataSource)) {
        var distance = 0;
        var desnivellPositiu = 0;
        var desnivellNegatiu = 0;
        viewer.dataSources.remove(gpxDataSource);
        $("#distanceLabel").text("\u21A6 ".concat((distance / 1000.0).toFixed(2), " km"));
        $("#desnivellPositiuLabel").text("\u2191 ".concat(desnivellPositiu.toFixed(2), " m"));
        $("#desnivellNegatiuLabel").text("\u2193 ".concat(desnivellNegatiu.toFixed(2), " m"));
      }

      gpxDataSource = new Cesium.CzmlDataSource();
      console.log("ruta", ruta);
      var fly = true;
      trackGeoJSON = {
        type: "FeatureCollection",
        features: []
      };
      trackGeoJSON.features.push(ut.tmUtils.extractSingleLineString(this.toGeoJSON())); //track base prim//

      viewer.dataSources.add(Cesium.GeoJsonDataSource.load(trackGeoJSON, {
        stroke: Cesium.Color.RED,
        fill: Cesium.Color.BURLYWOOD,
        strokeWidth: 1,
        markerSymbol: "?"
      })); // fi track base prim

      viewer.dataSources.add(gpxDataSource.load(ut.tmUtils.buildCZMLForTrack(trackGeoJSON, lGPX, "marker"))).then(function (ds) {
        trackDataSource = ds;

        if (fly) {
          viewer.flyTo(ds, {
            duration: 2
          });

          if (MAPSTATE.base.indexOf("topo") === -1) {
            addToponims(gpx);
          }
        } else {
          viewer.zoomTo(ds);
        }

        viewer.clock.shouldAnimate = false;
      });
    });
  }

  function setupLayers() {
    $("#iniciaHome").on("click", function () {
      ev.htmlEvents.toggleSideBar();
    });
    $("#baseLayers a").on("click", function (e) {
      $("#baseLayers a").removeClass("active");
      ly.fnLayers.removeBaseLayers(ImageryLayers, 2);
      ly.fnLayers.addBaseLayers(ImageryLayers, e.target.id);
      $("#".concat(e.target.id)).addClass("active");
      ev.htmlEvents.toggleSideBar();
      MAPSTATE.base = e.target.id;
    });
  } //start controls animacio


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
    var event = "play";
    var distance = 0;
    var oldCoord = null;
    var desnivellPositiu = 0;
    var desnivellNegatiu = 0;
    var oldElev = null;
    $("#infobox").show();

    if (viewer.clock.currentTime.equals(viewer.clock.stopTime) || event === "play") {
      viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(trackGeoJSON.features[0].properties.coordTimes[0]);
    }

    viewer.clock.onTick.addEventListener(function (clock) {
      var actualCoord = trackDataSource.entities.getById("track").position.getValue(clock.currentTime);
      var actualcartoCoord = Cesium.Ellipsoid.WGS84.cartesianToCartographic(actualCoord);
      var actualElev = actualcartoCoord.height;

      if (oldCoord && oldCoord != actualCoord) {
        var _distance = Cesium.Cartesian3.distance(actualCoord, oldCoord);

        distance += _distance;

        if (oldElev < actualElev) {
          var _desnivellPositiu = actualElev - oldElev;

          desnivellPositiu += _desnivellPositiu;
        }

        if (oldElev >= actualElev) {
          var _desnivellNegatiu = actualElev - oldElev;

          desnivellNegatiu += Math.abs(_desnivellNegatiu);
        }

        if (distance > 0) {
          $("#distanceLabel").html("".concat(distance / 1000.0, " km"));
          $("#distanceLabel").text("\u21A6 ".concat((distance / 1000.0).toFixed(2), " km"));
          $("#desnivellPositiuLabel").text("\u2191 ".concat(desnivellPositiu.toFixed(2), " m"));
          $("#desnivellNegatiuLabel").text("\u2193 ".concat(desnivellNegatiu.toFixed(2), " m"));
        }
      }

      oldCoord = actualCoord;
      oldElev = actualElev; // This example uses time offsets from the start to identify which parts need loading.

      var timeOffset = Cesium.JulianDate.secondsDifference(clock.currentTime, clock.startTime); //console.log("current-->",clock.currentTime);

      if (labelsDatasource && timeOffset > 1 && timeOffset < 100) {
        endLoading();
      }

      if (viewer.clock.currentTime === viewer.clock.stopTime) {
        console.info("final ruta");
      }
    }); // fa que e simbol del hiker es mogui

    viewer.trackedEntity = trackDataSource.entities.getById("track");
    trackDataSource.entities.getById("track").billboard.show = true;
    viewer.clock.shouldAnimate = true;
    console.log("startvideo-->click");
    initRender();
  }

  function animate() {
    var animate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
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
    /*
    camera.flyTo({
    	destination: Cesium.Cartesian3.fromDegrees(1.5455, 41.698, 450000),
    	duration: 4,
    });
    */
    camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(1.698078, 42.211228, 450000),
      duration: 0,
      complete: function complete() {
        setTimeout(function () {
          camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(1.698078, 42.211228, 5500),
            orientation: {
              heading: Cesium.Math.toRadians(360),
              pitch: Cesium.Math.toRadians(-53.0) //tilt

            },
            easingFunction: Cesium.EasingFunction.LINEAR_NONE
          }); //
        }, 1000);
      }
    });
    Cesium.Hash(viewer);
  } //ends controls animacio

}); // end ready

},{"./events.js":1,"./functions.js":2,"./layers.js":4,"./utils.js":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fnLayers = exports.BaseMaps = exports.LayerCarreteresICGC = exports.LayerRiscGeologicICGC = exports.LayerToponimsICGC = exports.LayersAllausICGC = exports.LayerSlopeICGC = exports.LayerCimsICGC = exports.LayerTerrenyICGC = exports.LayerTopoOSM = exports.LayerTopoClassicICGC = exports.LayerTopoICGC = exports.LayerRelleuICGC = exports.LayerGeologicICGC = exports.LayerOrtoICGC = exports.LayerRelleuEsri = exports.LayerOrtoEsri = void 0;
var URL_ORTO_ICGC = "https://geoserveis.icgc.cat/icc_mapesmultibase/noutm/wmts/orto/GRID3857/{z}/{x}/{y}.png";
var URL_TOPOGRAFIC_ICGC = "https://geoserveis.icgc.cat/icc_mapesmultibase/noutm/wmts/topo/GRID3857/{z}/{x}/{y}.jpeg";
var URL_Carreteres = "https://tilemaps.icgc.cat/mapfactory/wmts/hibrida_total/CAT3857/{z}/{x}/{y}.png";
var URL_TOPO_ICGC = "https://tilemaps.icgc.cat/mapfactory/wmts/topo_suau/CAT3857/{z}/{x}/{y}.png";
var URL_TOPO_OSM = "https://tilemaps.icgc.cat/mapfactory/wmts/osm_suau/CAT3857_15/{z}/{x}/{y}.png";
var URL_GEOL_ICGC = "https://tilemaps.icgc.cat/mapfactory/wmts/geologia/MON3857NW/{z}/{x}/{y}.png";
var URL_RELLEU_ICGC = "https://tilemaps.icgc.cat/mapfactory/wmts/relleu/CAT3857/{z}/{x}/{y}.png";
var URL_RELLEU_ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer?";
var URL_ADMIN = "https://tilemaps.icgc.cat/mapfactory/wmts/limits/CAT3857/{z}/{x}/{y}.png";
var URL_TOPONIM = "https://tilemaps.icgc.cat/mapfactory/wmts/toponimia/CAT3857/{z}/{x}/{y}.png";
var URL_TERRENY = "https://tilemaps.icgc.cat/terrenys/demextes";
var URL_ORTO_ESRI = "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer?";
var URL_CIMS_ICGC = "https://geoserveis.icgc.cat/icc_100cims/wms/service?";
var URL_SLOPE_ICGC = "https://geoserveis.icgc.cat/icgc_mp20p5m/wms/service?";
var URL_ALLAUS_ICGC = "https://siurana.icgc.cat/geoserver/nivoallaus/wms?";
var URL_RISC_GEOLOGIC = "https://geoserveis.icgc.cat/icgc_riscgeologic/wms/service?";
var LayerOrtoEsri = new Cesium.ArcGisMapServerImageryProvider({
  url: URL_ORTO_ESRI,
  enablePickFeatures: false,
  maximumLevel: 10,
  credit: "ESRI"
});
exports.LayerOrtoEsri = LayerOrtoEsri;
var LayerRelleuEsri = new Cesium.ArcGisMapServerImageryProvider({
  url: URL_RELLEU_ESRI,
  enablePickFeatures: false,
  maximumLevel: 10,
  credit: "ESRI"
});
exports.LayerRelleuEsri = LayerRelleuEsri;
var LayerOrtoICGC = new Cesium.UrlTemplateImageryProvider({
  url: URL_ORTO_ICGC,
  enablePickFeatures: false,
  maximumLevel: 18,
  credit: "Institut Cartogràfic i Geològic de Catalunya"
});
exports.LayerOrtoICGC = LayerOrtoICGC;
var LayerGeologicICGC = new Cesium.UrlTemplateImageryProvider({
  url: URL_GEOL_ICGC,
  enablePickFeatures: false,
  maximumLevel: 14,
  credit: "Institut Cartogràfic i Geològic de Catalunya"
});
exports.LayerGeologicICGC = LayerGeologicICGC;
var LayerRelleuICGC = new Cesium.UrlTemplateImageryProvider({
  url: URL_RELLEU_ICGC,
  enablePickFeatures: false,
  maximumLevel: 18,
  credit: "Institut Cartogràfic i Geològic de Catalunya"
});
exports.LayerRelleuICGC = LayerRelleuICGC;
var LayerTopoICGC = new Cesium.UrlTemplateImageryProvider({
  url: URL_TOPO_ICGC,
  enablePickFeatures: false,
  maximumLevel: 18,
  credit: "Institut Cartogràfic i Geològic de Catalunya"
});
exports.LayerTopoICGC = LayerTopoICGC;
var LayerTopoClassicICGC = new Cesium.UrlTemplateImageryProvider({
  url: URL_TOPOGRAFIC_ICGC,
  enablePickFeatures: false,
  maximumLevel: 18,
  credit: "Institut Cartogràfic i Geològic de Catalunya"
});
exports.LayerTopoClassicICGC = LayerTopoClassicICGC;
var LayerTopoOSM = new Cesium.UrlTemplateImageryProvider({
  url: URL_TOPO_OSM,
  enablePickFeatures: false,
  maximumLevel: 12,
  credit: "OpenStreetMap Contributors"
});
exports.LayerTopoOSM = LayerTopoOSM;
var LayerTerrenyICGC = new Cesium.CesiumTerrainProvider({
  url: URL_TERRENY
});
exports.LayerTerrenyICGC = LayerTerrenyICGC;
var LayerCimsICGC = new Cesium.WebMapServiceImageryProvider({
  url: URL_CIMS_ICGC,
  layers: "0",
  enablePickFeatures: true,
  showEntitiesLabels: true,
  credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
  parameters: {
    transparent: "true",
    format: "image/png"
  }
});
exports.LayerCimsICGC = LayerCimsICGC;
var LayerSlopeICGC = new Cesium.WebMapServiceImageryProvider({
  url: URL_SLOPE_ICGC,
  layers: "MP20P5M_PA",
  enablePickFeatures: true,
  showEntitiesLabels: true,
  credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
  parameters: {
    transparent: "true",
    format: "image/png"
  }
});
exports.LayerSlopeICGC = LayerSlopeICGC;
var LayersAllausICGC = new Cesium.WebMapServiceImageryProvider({
  url: URL_ALLAUS_ICGC,
  layers: "zonesallaus",
  enablePickFeatures: true,
  showEntitiesLabels: true,
  credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
  parameters: {
    transparent: "true",
    format: "image/png"
  }
});
exports.LayersAllausICGC = LayersAllausICGC;
var LayerToponimsICGC = new Cesium.UrlTemplateImageryProvider({
  url: URL_TOPONIM,
  enablePickFeatures: false,
  maximumLevel: 18,
  credit: "Institut Cartogràfic i Geològic de Catalunya"
});
exports.LayerToponimsICGC = LayerToponimsICGC;
var LayerRiscGeologicICGC = new Cesium.WebMapServiceImageryProvider({
  url: URL_RISC_GEOLOGIC,
  layers: "G6FIA_PA",
  enablePickFeatures: true,
  showEntitiesLabels: true,
  credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
  parameters: {
    transparent: "true",
    format: "image/png"
  }
});
exports.LayerRiscGeologicICGC = LayerRiscGeologicICGC;
var LayerCarreteresICGC = new Cesium.UrlTemplateImageryProvider({
  url: URL_Carreteres,
  enablePickFeatures: false,
  maximumLevel: 18,
  credit: "Institut Cartogràfic i Geològic de Catalunya"
});
exports.LayerCarreteresICGC = LayerCarreteresICGC;
var BaseMaps = {
  orto: "ortofotoMenu",
  topo: "topographicMenu",
  topoClassic: "topoClassicMenu",
  relleu: "relleuMenu",
  geologic: "geologicMenu"
};
exports.BaseMaps = BaseMaps;

var fnLayers = function () {
  var addBaseLayers = function addBaseLayers(ImageryLayers, id) {
    if (id === BaseMaps.orto) {
      ImageryLayers.addImageryProvider(LayerOrtoEsri, 0);
      ImageryLayers._layers[0].alpha = 0.5;
      ImageryLayers.addImageryProvider(LayerOrtoICGC, 1);
    } else if (id === BaseMaps.topo) {
      ImageryLayers.addImageryProvider(LayerTopoOSM, 0);
      ImageryLayers._layers[0].alpha = 0.5;
      ImageryLayers.addImageryProvider(LayerTopoICGC, 1);
    } else if (id === BaseMaps.topoClassic) {
      ImageryLayers.addImageryProvider(LayerRelleuICGC, 0);
      ImageryLayers.addImageryProvider(LayerTopoClassicICGC, 1);
      ImageryLayers._layers[1].alpha = 0.7;
    } else if (id === BaseMaps.relleu) {
      ImageryLayers.addImageryProvider(LayerRelleuEsri, 0);
      ImageryLayers._layers[0].alpha = 0.5;
      ImageryLayers.addImageryProvider(LayerRelleuICGC, 1);
    } else if (id === BaseMaps.geologic) {
      ImageryLayers.addImageryProvider(LayerRelleuICGC, 0);
      ImageryLayers.addImageryProvider(LayerGeologicICGC, 1);
      ImageryLayers._layers[1].alpha = 0.5;
    } else {}
  };

  var removeBaseLayers = function removeBaseLayers(ImageryLayers, num) {
    try {
      if (num === 1) {
        ImageryLayers.remove(ImageryLayers.get(1));
      } else {
        ImageryLayers.remove(ImageryLayers.get(1));
        ImageryLayers.remove(ImageryLayers.get(0));
      }
    } catch (err) {
      console.info(err);
      return false;
    }
  };

  return {
    removeBaseLayers: removeBaseLayers,
    addBaseLayers: addBaseLayers
  };
}();

exports.fnLayers = fnLayers;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tmUtils = void 0;

var tmUtils = function () {
  var tmConstants = {
    TRAIL_MARKER_COLOR: '7A5C1E',
    WAYPOINT_COLOR: '#3887BE',
    INSIDE_TRACK_COLOR: [255, 0, 0, 205],
    TRACK_COLOR: [255, 0, 0, 100],
    SELECTED_THUMBNAIL_COLOR: '#00FF00',
    FAVORITE: '&#10029;',
    KEYCODE_ESC: 27,
    KEYCODE_SPACE: 32,
    CAMERA_OFFSET: 6000,
    FLY_TIME: 2,
    MIN_SAMPLE_DISTANCE: 10,
    AUTOPLAY_DELAY: 5000
  };

  var calculateTrackMetrics = function calculateTrackMetrics(feature, tm) {
    if (!Array.isArray(feature.geometry.coordinates)) {
      // Some gps tracks misbehave, so skip offending part
      return null;
    }

    var distance = 0;
    var elevation = 0;
    var maxElevation = 0;
    var minElevation = feature.geometry.coordinates[0][2]; // Let smooth out the elevation data using a moving average

    var smoothElevation = smoothElevationData(feature);

    for (var i = 0; i < feature.geometry.coordinates.length - 1; i++) {
      distance += L.latLng(feature.geometry.coordinates[i][1], feature.geometry.coordinates[i][0]).distanceTo(L.latLng(feature.geometry.coordinates[i + 1][1], feature.geometry.coordinates[i + 1][0]));

      if (smoothElevation[i] < smoothElevation[i + 1]) {
        // elevation += feature.geometry.coordinates[i+1][2] - feature.geometry.coordinates[i][2];
        elevation += smoothElevation[i + 1] - smoothElevation[i];
      }

      if (feature.geometry.coordinates[i][2] > maxElevation) {
        maxElevation = feature.geometry.coordinates[i][2];
      }

      if (feature.geometry.coordinates[i][2] < minElevation) {
        minElevation = feature.geometry.coordinates[i][2];
      }
    } // One more to go for elevation


    if (feature.geometry.coordinates[i][2] > maxElevation) {
      maxElevation = feature.geometry.coordinates[i][2];
    }

    if (feature.geometry.coordinates[i][2] < minElevation) {
      minElevation = feature.geometry.coordinates[i][2];
    }

    return [tm[0] + distance / 1000, tm[1] + elevation, Math.max(tm[2], maxElevation), Math.min(tm[3], minElevation)]; // return [(distance/1000).toFixed(2), elevation.toFixed(2), maxElevation.toFixed(2), minElevation.toFixed(2)];
  }; // This private function attemps to reduce elevation data noise and elevation gain exageration by running a (WINDOW size) moving average


  var smoothElevationData = function smoothElevationData(feature) {
    var WINDOW = 5;
    var smoothElevation = new Array(feature.geometry.coordinates.length);

    for (var i = 0; i < feature.geometry.coordinates.length - 1; i++) {
      var w = i < WINDOW ? i + 1 : WINDOW;
      smoothElevation[i] = 0;

      for (var j = i - w + 1; j <= i; j++) {
        smoothElevation[i] += feature.geometry.coordinates[j][2];
      }

      smoothElevation[i] = smoothElevation[i] / w;
    }

    return smoothElevation;
  };

  var isValidEmail = function isValidEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  var buildCZMLForTrack = function buildCZMLForTrack(trackGeoJSON, l, trackType) {
    // Remove all features except LineString (for now)
    var j = 0;
    var i = trackGeoJSON.features.length;

    while (i--) {
      if (trackGeoJSON.features[i].geometry.type !== 'LineString') {
        trackGeoJSON.features.splice(i, 1);
      } else {
        // Also remove feature if the LineString has no elevation data
        if (!Array.isArray(trackGeoJSON.features[i].geometry.coordinates) || trackGeoJSON.features[i].geometry.coordinates[0].length < 3) {
          trackGeoJSON.features.splice(i, 1);
        }
      }
    }

    var d = new Date("2019-06-18 12:00:00"); //console.info(d);

    for (j = 0; j < trackGeoJSON.features.length; j++) {
      //if (isInvalidTimesArray(trackGeoJSON.features[j].properties.coordTimes)) {
      trackGeoJSON.features[j].properties.coordTimes = []; // var d = new Date(2015);

      for (i = 0; i < trackGeoJSON.features[j].geometry.coordinates.length; i++) {
        //console.info(d.toISOString());
        trackGeoJSON.features[j].properties.coordTimes.push(d.toISOString());
        d.setSeconds(d.getSeconds() + 10);
      } //}

    } // By default, clock multiplier is 100, but duration should be less than 120 sec or greater than 240 sec


    function calcMult(rd) {
      if (rd > 36000) {
        return rd / 360;
      }

      if (rd < 12000) {
        return rd / 120;
      }

      return 100;
    } // Base structure for the CZML


    var trackCZML = [{
      id: 'document',
      name: 'Track CZML',
      version: '1.0',
      clock: {
        interval: '',
        currentTime: '',
        multiplier: 100,
        range: 'CLAMPED',
        step: 'SYSTEM_CLOCK_MULTIPLIER'
      }
    }, {
      id: 'track',
      availability: trackGeoJSON.features[0].properties.coordTimes[0] + '/' + trackGeoJSON.features[0].properties.coordTimes[trackGeoJSON.features[0].properties.coordTimes.length - 1],
      path: {
        material: {
          polylineOutline: {
            color: {
              rgba: tmConstants.INSIDE_TRACK_COLOR
            },
            outlineColor: {
              rgba: tmConstants.TRACK_COLOR
            },
            outlineWidth: 5
          }
        },
        width: 7,
        leadTime: 0,
        resolution: 60,
        clampToground: true
      },
      billboard: {
        image: './dist/img/logo.png',
        verticalOrigin: 'BOTTOM',
        scale: 0.5,
        show: false
      },
      position: {
        cartographicDegrees: []
      },
      viewFrom: {
        'cartesian': [0, -1000, 2000]
      }
    }, {
      id: 'trailhead',
      billboard: {
        image: './dist/img/logo.png',
        verticalOrigin: 'BOTTOM',
        scale: 0.5
      },
      position: {
        cartographicDegrees: [trackGeoJSON.features[0].geometry.coordinates[0][0], trackGeoJSON.features[0].geometry.coordinates[0][1], trackGeoJSON.features[0].geometry.coordinates[0][2]]
      }
    }, {
      id: 'nw',
      description: 'anchor fly',
      point: {
        color: {
          rgba: [0, 0, 0, 0]
        }
      },
      position: {
        cartographicDegrees: [l.getBounds().getWest(), l.getBounds().getNorth(), trackGeoJSON.features[0].geometry.coordinates[0][2]]
      }
    }, {
      id: 'se',
      description: 'anchor fly',
      point: {
        color: {
          rgba: [0, 0, 0, 0]
        }
      },
      position: {
        cartographicDegrees: [l.getBounds().getEast(), l.getBounds().getSouth(), trackGeoJSON.features[0].geometry.coordinates[0][2]]
      }
    }];

    function keepSample(feature, index) {
      trackCZML[1].position.cartographicDegrees.push(trackGeoJSON.features[feature].properties.coordTimes[index]);
      trackCZML[1].position.cartographicDegrees.push(trackGeoJSON.features[feature].geometry.coordinates[index][0]);
      trackCZML[1].position.cartographicDegrees.push(trackGeoJSON.features[feature].geometry.coordinates[index][1]);
      trackCZML[1].position.cartographicDegrees.push(trackGeoJSON.features[feature].geometry.coordinates[index][2]);
    } // Iterate over Linestring Features


    var lastIndex = 0;

    for (j = 0; j < trackGeoJSON.features.length; j++) {
      // Simplify track segment by dropping samples closer than tmConstants.MIN_SAMPLE_DISTANCE meters
      lastIndex = 0;

      for (i = 0; i < trackGeoJSON.features[j].geometry.coordinates.length; i++) {
        if (i === 0) {
          keepSample(j, i);
        } else {
          var cartPrev = Cesium.Cartesian3.fromDegrees(trackGeoJSON.features[j].geometry.coordinates[lastIndex][0], trackGeoJSON.features[j].geometry.coordinates[lastIndex][1], trackGeoJSON.features[j].geometry.coordinates[lastIndex][2]);
          var cartCurr = Cesium.Cartesian3.fromDegrees(trackGeoJSON.features[j].geometry.coordinates[i][0], trackGeoJSON.features[j].geometry.coordinates[i][1], trackGeoJSON.features[j].geometry.coordinates[i][2]);

          if (Cesium.Cartesian3.distance(cartCurr, cartPrev) > tmConstants.MIN_SAMPLE_DISTANCE) {
            keepSample(j, i);
            lastIndex = i;
          }
        }
      }
    } // Set up simulation clock parameters


    trackCZML[0].clock.interval = trackGeoJSON.features[0].properties.coordTimes[0] + '/' + trackGeoJSON.features[j - 1].properties.coordTimes[lastIndex];
    trackCZML[0].clock.currentTime = trackGeoJSON.features[j - 1].properties.coordTimes[lastIndex];
    trackCZML[0].clock.multiplier = calcMult((new Date(trackGeoJSON.features[j - 1].properties.coordTimes[lastIndex]).getTime() - new Date(trackGeoJSON.features[0].properties.coordTimes[0]).getTime()) / 1000);
    trackCZML[1].availability = trackGeoJSON.features[0].properties.coordTimes[0] + '/' + trackGeoJSON.features[j - 1].properties.coordTimes[lastIndex];
    return trackCZML;
  };

  var buildCZMLForGeoTags = function buildCZMLForGeoTags(geoTags, viewer, callback) {
    function createSmallThumbnail(img, thumbSize, borderSize, borderColor) {
      var canvas = document.createElement('canvas');
      canvas.width = thumbSize;
      canvas.height = thumbSize;
      var ctx = canvas.getContext('2d');
      ctx.lineWidth = borderSize;
      ctx.strokeStyle = borderColor;
      ctx.drawImage(img, 0, 0, thumbSize, thumbSize);
      ctx.strokeRect(0, 0, thumbSize, thumbSize);
      return canvas;
    } // Base CZML structure


    var geoTagsCZML = [{
      id: 'document',
      name: 'GeoTags CZML',
      version: '1.0'
    }];

    function addCZMLItem(picIndex, position, img) {
      var d = $.Deferred();

      img.onload = function () {
        geoTagsCZML.push({
          id: 'pic-' + picIndex,
          billboard: {
            image: createSmallThumbnail(img, 44, 4, '#fff'),
            verticalOrigin: 'BOTTOM',
            show: true
          },
          position: {
            cartographicRadians: position
          }
        });
        geoTagsCZML.push({
          id: 'picS-' + picIndex,
          billboard: {
            image: createSmallThumbnail(img, 44, 4, tmConstants.SELECTED_THUMBNAIL_COLOR),
            verticalOrigin: 'BOTTOM',
            show: false
          },
          position: {
            cartographicRadians: position
          }
        });
        d.resolve();
      };

      return d.promise();
    } // Grab thumbnail height info


    var p = []; // Save here indexes of pics that have lat lng

    var pos = [];

    for (var i = 0; i < geoTags.trackPhotos.length; i++) {
      if (geoTags.trackPhotos[i].picLatLng) {
        pos.push(Cesium.Cartographic.fromDegrees(geoTags.trackPhotos[i].picLatLng[1], geoTags.trackPhotos[i].picLatLng[0]));
        p.push(i);
      }
    }

    if (p.length > 0) {
      Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, pos).then(function (pos) {
        var addCZMLItemTasks = [];

        for (var k = 0; k < p.length; k++) {
          var img = new Image();
          img.src = 'data:image/jpeg;base64,' + geoTags.trackPhotos[p[k]].picThumbBlob;
          /* img.onload = function() {
          	console.log('image loaded');
          }; */

          addCZMLItemTasks.push(addCZMLItem(geoTags.trackPhotos[p[k]].picIndex, [pos[k].longitude, pos[k].latitude, pos[k].height + 50], img));
        }

        $.when.apply(this, addCZMLItemTasks).then(function () {
          callback(geoTagsCZML);
        });
      });
    }
  };

  var extractSingleLineString = function extractSingleLineString(t) {
    var sLS = {
      geometry: {
        coordinates: [],
        type: 'LineString'
      },
      properties: {
        coordTimes: []
      },
      type: 'Feature'
    };

    for (var i = 0; i < t.features.length; i++) {
      // Grab the first time found
      if (t.features[i].properties.time && !sLS.properties.time) {
        sLS.properties.time = t.features[i].properties.time;
      }

      if (t.features[i].geometry.type === 'LineString') {
        if (t.features[i].geometry.coordinates[0].length >= 3) {
          sLS.geometry.coordinates.push.apply(sLS.geometry.coordinates, t.features[i].geometry.coordinates);

          if (t.features[i].properties.coordTimes) {
            sLS.properties.coordTimes.push.apply(sLS.properties.coordTimes, t.features[i].properties.coordTimes);
          }
        }
      } else {
        if (t.features[i].geometry.type === 'MultiLineString') {
          for (var j = 0; j < t.features[i].geometry.coordinates.length; j++) {
            if (t.features[i].geometry.coordinates[j][0].length >= 3) {
              sLS.geometry.coordinates.push.apply(sLS.geometry.coordinates, t.features[i].geometry.coordinates[j]);
            }

            if (t.features[i].properties.coordTimes[j]) {
              sLS.properties.coordTimes.push.apply(sLS.properties.coordTimes, t.features[i].properties.coordTimes[j]);
            }
          }
        }
      }
    }

    return sLS;
  };

  return {
    calculateTrackMetrics: calculateTrackMetrics,
    isValidEmail: isValidEmail,
    buildCZMLForTrack: buildCZMLForTrack,
    buildCZMLForGeoTags: buildCZMLForGeoTags,
    extractSingleLineString: extractSingleLineString
  };
}();

exports.tmUtils = tmUtils;

},{}]},{},[3]);

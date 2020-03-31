(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// @flow
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var fa = require("./utils");

var west = 2.0;
var south = 42.0;
var east = 2.1;
var north = 42.2;
var trackDataSource = null;
var trackGeoJSON = null;
var URL_ORTO = "https://geoserveis.icgc.cat/icc_mapesmultibase/noutm/wmts/orto/GRID3857/{z}/{x}/{y}.jpeg";
var URL_carreteres = "https://tilemaps.icgc.cat/mapfactory/wmts/hibrida_total/CAT3857/{z}/{x}/{y}.png";
var URL_TOPO = "https://tilemaps.icgc.cat/mapfactory/wmts/topo_suau/CAT3857/{z}/{x}/{y}.png";
var URL_GEOL = "https://tilemaps.icgc.cat/mapfactory/wmts/geologia/MON3857NW/{z}/{x}/{y}.png";
var URL_RELLEU = "https://tilemaps.icgc.cat/mapfactory/wmts/gris_topo_suau/CAT3857/{z}/{x}/{y}.png";
var URL_ADMIN = "https://tilemaps.icgc.cat/mapfactory/wmts/limits/CAT3857/{z}/{x}/{y}.png";
var URL_TERRENY = "https://tilemaps.icgc.cat/terrenys/demextes";
var imPro;
var dev = true;
var viewer;
var rutaIniciada = false;
var isInPause = true;
var labelsDatasource;
$('.ui.fluid.dropdown').dropdown({
  maxSelections: 3
});
$('.label.ui.dropdown').dropdown();
$('.no.label.ui.dropdown').dropdown({
  useLabels: false
});
$('.ui.button').on('click', function () {
  $('.ui.dropdown').dropdown('restore defaults');
});
$('.ui.button.fileRequest').click(function () {
  // // hope the server sets Content-Disposition: attachment!
  var ruta = $(this).attr('data-gpx');
  console.log("onDownload");
  window.location = ruta;
});
$(window.document).ready(function () {
  Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(west, south, east, north);

  if (dev) {
    imPro = new Cesium.UrlTemplateImageryProvider({
      url: URL_ORTO,
      enablePickFeatures: false,
      maximumLevel: 18,
      credit: "Institut Cartogràfic i Geològic de Catalunya"
    });
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
  var scene = viewer.scene;
  scene.globe.depthTestingAgainstTerrain = true;
  var camera = viewer.scene.camera;
  viewer.scene.globe.enableLighting = true;
  viewer.scene.fog.enabled = true;
  viewer.scene.fog.density = 0.0002;
  viewer.scene.fog.screenSpaceErrorFactor = 2;
  vistaInicial();
  initEvents();
  setupLayers();
  getElementById();

  function showEntitiesLabels(value) {
    if (labelsDatasource) {
      labelsDatasource.show = value;
      return true;
    }
  }

  function checkOptions(concepte) {
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
  }

  function addToponims(toponimsGeoJson) {
    viewer.entities.removeAll();
    jQuery.getJSON("dist/data/rutes/MAP_NAME_".concat(toponimsGeoJson.replace("gpx", "geojson")), function (respuestaGeonames) {
      for (var i = 0; i < respuestaGeonames.features.length; i++) {
        if (respuestaGeonames.features[i].properties.Concepte != "edif.") {
          var entity = respuestaGeonames.features[i];
          var opt = checkOptions(entity.properties.Concepte);
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


        if (i == respuestaGeonames.features.length - 1) {
          jQuery("#menuSearch").removeClass("vermell");
        }
      } //en for label

    }); //end then
  }

  function addToponimsOLd(toponimsGeoJson) {
    if (viewer.dataSources.contains(labelsDatasource)) {
      viewer.dataSources.remove(labelsDatasource);
    }

    labelsDatasource = new Cesium.CustomDataSource("data");
    var promise = Cesium.GeoJsonDataSource.load("dist/data/rutes/MAP_NAME_".concat(toponimsGeoJson.replace("gpx", "geojson")));
    promise.then(function (dataSource) {
      var entities = dataSource.entities.values;

      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var opt = checkOptions(entity["_properties"].Concepte);
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
    $('#uploadbutton').on("change", function () {
      console.log("onUpload");
      var ruta = document.getElementById('uploadbutton').files[0];
      var gpx = $(ruta).attr('name');
      console.log('valuegpx -->', gpx);

      if (ruta != null) {
        $("#controls").show();
        $("#pausa").hide();
        $("#loading").hide();
        showEntitiesLabels(false);
        rutaIniciada = false;
        console.log("path-->", ruta);
        $('#uploadButton').prop("name", ruta);
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
      }
    });
    jQuery("#menuIcon").on("click", function () {
      //		$("#sideBarOptions").sidebar("toggle");
      $("#sideBarOptions").first().sidebar("toggle");
      $("toggle").removeClass('disabled');
    });
    jQuery("#play").on("click", function () {
      if (rutaIniciada) {
        //canvia valor al contrari. SI està en pausa (false), al fer clic canvia a noPausa(true) i al reves. 
        //De manera que si està en pause(false), l enterPauseMode serà false i llavors animarà.
        //Si està en play(NoPause, true), el enterPause mode serà true i llavors pausarà.
        isInPause = !isInPause;
        enterPauseMode(isInPause); //Si no està en pausa ni està en play farà el ELSE (que es començar l'animació desde el principi (startPlaying))
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
    $("#playpausa").on("click", function () {
      //console.info("playpausa");
      enterPauseMode(false);
      $("#pausa").show();
      $("#loading").hide(); //  $("#playpausa").hide();

      $("#play").hide();
    });
    $("#home").on("click", function () {
      if (rutaIniciada) {
        initAnimation();
        jQuery("#play i").removeClass("circular play icon");
        jQuery("#play i").addClass("circular pause icon");
      }
    });
    $('#erasefilebutton').on("click", function () {
      console.log("clickerase");

      if (viewer.dataSources.contains(gpxDataSource)) {
        viewer.dataSources.removeAll();
      }
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
          $("#loading").hide();
          showEntitiesLabels(false);
          rutaIniciada = false;
          loadGPX(result.id);
        }
      }
    });
    $("#cimsToggle").change(function () {
      console.log("cimsToggle");

      if ($(this).is(':checked')) {
        console.log("oncims");
        imPro = new Cesium.WebMapServiceImageryProvider({
          url: 'http://geoserveis.icc.cat/icc_100cims/wms/service?',
          layers: '0',
          enablePickFeatures: true,
          showEntitiesLabels: true,
          credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
          parameters: {
            transparent: 'true',
            format: 'image/png'
          }
        });
        var layers = viewer.imageryLayers;
        layers.addImageryProvider(imPro);
      } else {
        console.log("offcims");
        var layers = viewer.imageryLayers; //quina es?

        var baseLayer = layers.get(1);
        console.log("typeof => ", _typeof(layers));
        console.log("layers =>", layers);
        var layersArray = layers._layers;
        console.log(_typeof(layersArray));
        console.log("layers =>", layersArray);
        layersArray.map(function (layer, index) {
          console.log(layer);
          console.log("imageryproveider", layer.imageryProvider);

          if (layer.imageryProvider._resource._url === 'http://geoserveis.icc.cat/icc_100cims/wms/service') {
            console.log("indice =>", index);
            layers.remove(layer);
          }
        });
      }
    });
    $("#allausToggle").change(function () {
      console.log("allausToggle");

      if ($(this).is(':checked')) {
        console.log("onallaus");
        imPro = new Cesium.WebMapServiceImageryProvider({
          url: 'http://siurana.icgc.cat/geoserver/nivoallaus/wms?',
          layers: 'zonesallaus',
          enablePickFeatures: true,
          showEntitiesLabels: true,
          credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
          parameters: {
            transparent: 'true',
            format: 'image/png'
          }
        });
        var layers = viewer.imageryLayers;
        layers.addImageryProvider(imPro);
      } else {
        console.log("offallaus");
        var layers = viewer.imageryLayers; //quina es?

        var baseLayer = layers.get(1);
        console.log("typeof => ", _typeof(layers));
        console.log("layers =>", layers);
        var layersArray = layers._layers;
        console.log(_typeof(layersArray));
        console.log("layers =>", layersArray);
        layersArray.map(function (layer, index) {
          console.log(layer);
          console.log("imageryproveider", layer.imageryProvider);

          if (layer.imageryProvider._resource._url === 'http://siurana.icgc.cat/geoserver/nivoallaus/wms') {
            console.log("indice =>", index);
            layers.remove(layer);
          }
        });
      }
    });
    $("#landslidesToggle").change(function () {
      console.log("landslidesToggle");

      if ($(this).is(':checked')) {
        console.log("onlandslides");
        imPro = new Cesium.WebMapServiceImageryProvider({
          url: 'http://geoserveis.icgc.cat/icgc_riscgeologic/wms/service?',
          layers: 'G6FIA_PA',
          enablePickFeatures: true,
          showEntitiesLabels: true,
          credit: new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),
          parameters: {
            transparent: 'true',
            format: 'image/png'
          }
        });
        var layers = viewer.imageryLayers;
        layers.addImageryProvider(imPro);
      } else {
        console.log("offlandslides");
        var layers = viewer.imageryLayers; //quina es?

        var baseLayer = layers.get(1);
        console.log("typeof => ", _typeof(layers));
        console.log("layers =>", layers);
        var layersArray = layers._layers;
        console.log(_typeof(layersArray));
        console.log("layers =>", layersArray);
        layersArray.map(function (layer, index) {
          console.log(layer);
          console.log("imageryproveider", layer.imageryProvider);

          if (layer.imageryProvider._resource._url === 'http://geoserveis.icgc.cat/icgc_riscgeologic/wms/service') {
            console.log("indice =>", index);
            layers.remove(layer);
          }
        });
      }
    });
    $("#carreteresToggle").change(function () {
      console.log("carreteresToggle");

      if ($(this).is(':checked')) {
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
        var layers = viewer.imageryLayers; //quina es?

        var baseLayer = layers.get(1);
        console.log("typeof => ", _typeof(layers));
        console.log("layers =>", layers);
        var layersArray = layers._layers;
        console.log(_typeof(layersArray));
        console.log("layers =>", layersArray);
        layersArray.map(function (layer, index) {
          console.log(layer);
          console.log("imageryproveider", layer.imageryProvider);

          if (layer.imageryProvider._resource._url === URL_carreteres) {
            console.log("indice =>", index);
            layers.remove(layer);
          }
        });
      }
    });
  }

  var gpxDataSource;

  function loadGPX(gpx) {
    var ruta = "dist/data/rutes/".concat(gpx);
    var lGPX = omnivore.gpx(ruta, null).on("ready", function (data) {
      $('.ui.button.fileRequest').attr('data-gpx', ruta);
      $('.ui.button.fileRequest').attr("href", ruta);
      $('#uploadButton').prop("name", ruta);

      if (viewer.dataSources.contains(gpxDataSource)) {
        viewer.dataSources.remove(gpxDataSource);
      }

      $('#uploadbutton').attr('data-gpx', gpxDataSource);
      gpxDataSource = new Cesium.CzmlDataSource();
      var fly = true;
      trackGeoJSON = {
        type: "FeatureCollection",
        features: []
      };
      trackGeoJSON.features.push(fa.tmUtils.extractSingleLineString(this.toGeoJSON())); //track base prim//

      viewer.dataSources.add(Cesium.GeoJsonDataSource.load(trackGeoJSON, {
        stroke: Cesium.Color.RED,
        fill: Cesium.Color.BURLYWOOD,
        strokeWidth: 1,
        markerSymbol: '?'
      })); // fi track base

      viewer.dataSources.add(gpxDataSource.load(fa.tmUtils.buildCZMLForTrack(trackGeoJSON, lGPX, "marker"))).then(function (ds) {
        // trackDataSource segueix el track amb animació
        trackDataSource = ds;

        if (fly) {
          viewer.flyTo(ds, {
            duration: 2
          });
          addToponims(gpx);
        } else {
          console.info("faig zoom");
          viewer.zoomTo(ds);
        }

        viewer.clock.shouldAnimate = false; //const autoPlay = true;
        //setUp3DTrackControls (trackGeoJSON, autoPlay);
        // var trailHeadHeight = trackGeoJSON.features[0].geometry.coordinates[0][2];
        // setUp3DZoomControls(trailHeadHeight);
        //addToponims(gpx);
      });
    });
  }

  ;

  function setupLayers() {
    $("#topographicMenu").on("click", function () {
      console.log("entrotopo");
      imPro = new Cesium.UrlTemplateImageryProvider({
        url: URL_TOPO,
        enablePickFeatures: false,
        maximumLevel: 18,
        credit: "Institut Cartogràfic i Geològic de Catalunya"
      });
      var layers = viewer.imageryLayers;
      var baseLayer = layers.get(0);
      layers.remove(baseLayer);
      layers.addImageryProvider(imPro);
    });
    $("#ortofotoMenu").on("click", function () {
      console.log("entroorto");
      imPro = new Cesium.UrlTemplateImageryProvider({
        url: URL_ORTO,
        enablePickFeatures: false,
        maximumLevel: 18,
        credit: "Institut Cartogràfic i Geològic de Catalunya"
      });
      var layers = viewer.imageryLayers;
      var baseLayer = layers.get(0);
      layers.remove(baseLayer);
      layers.addImageryProvider(imPro);
    });
    $("#adminMenu").on("click", function () {
      console.log("entrohibrid");
      imPro = new Cesium.UrlTemplateImageryProvider({
        url: URL_ADMIN,
        enablePickFeatures: false,
        maximumLevel: 18,
        credit: "Institut Cartogràfic i Geològic de Catalunya"
      });
      var layers = viewer.imageryLayers;
      var baseLayer = layers.get(0);
      layers.remove(baseLayer);
      layers.addImageryProvider(imPro);
    });
    $(".carreteres").on("click", function () {
      console.log("entrocarreteres");
      imPro = new Cesium.UrlTemplateImageryProvider({
        url: URL_HIBRID,
        enablePickFeatures: false,
        maximumLevel: 18,
        credit: "Institut Cartogràfic i Geològic de Catalunya"
      });
      var layers = viewer.imageryLayers;
      var baseLayer = layers.get(1);
      layers.remove(baseLayer);
      layers.addImageryProvider(imPro);
    });
    $("#relleuMenu").on("click", function () {
      console.log("entrorelleu");
      imPro = new Cesium.UrlTemplateImageryProvider({
        url: URL_RELLEU,
        enablePickFeatures: false,
        maximumLevel: 18,
        credit: "Institut Cartogràfic i Geològic de Catalunya"
      });
      var layers = viewer.imageryLayers;
      var baseLayer = layers.get(0);
      layers.remove(baseLayer);
      layers.addImageryProvider(imPro);
    });
    $("#geologicMenu").on("click", function () {
      console.log("entrogeo");
      imPro = new Cesium.UrlTemplateImageryProvider({
        url: URL_GEOL,
        enablePickFeatures: false,
        maximumLevel: 18,
        credit: "Institut Cartogràfic i Geològic de Catalunya"
      });
      var layers = viewer.imageryLayers;
      var baseLayer = layers.get(0);
      layers.remove(baseLayer);
      layers.addImageryProvider(imPro);
    });
  }

  ; //start controls animacio

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
    console.info("entro"); //$("#playicon").addClass("loading");
    //FIXME SAME VALUE ALWAYS

    var event = "play"; //esto anima o deja estaico

    if (viewer.clock.currentTime.equals(viewer.clock.stopTime) || event === "play") {
      //Resetea la ruta
      viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(trackGeoJSON.features[0].properties.coordTimes[0]);
    } //hasta aqui


    viewer.trackedEntity = trackDataSource.entities.getById("track");
    /*viewer.trackedEntity = trackDataSourced.entities.getById("track");*/
    // fa que e simbol del hiker es mogui

    trackDataSource.entities.getById("track").billboard.show = true;
    /*trackDataSourced.entities.getById("track").billboard.show = true;*/

    viewer.clock.shouldAnimate = true;
  }

  function animate() {
    var animate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    viewer.clock.shouldAnimate = animate;
  }

  function endLoading() {
    // console.info("endLoading");
    $("#loading").hide(); //$("#playpausa").hide();
    // $("#play").hide();
    // $("#pausa").show();
  }

  function resetPlay() {
    viewer.clock.shouldAnimate = false;
    viewer.trackedEntity = undefined;
    viewer.trackedEntity = undefined;
    viewer.dataSources.removeAll(); //trackDataSource.entities.getById('track').billboard.show = false;
    //readyToPlayButtonState();
    //viewer.clock.onTick.removeEventListener(clockTracker);
  }

  function initAnimation() {
    isInPause = false;
    viewer.clock.currentTime = viewer.clock.startTime;
    viewer.clock.shouldAnimate = true;
  }

  function enterPauseMode(isInPause) {
    //viewer.clock.onTick.removeEventListener(clockTracker);
    if (isInPause) {
      setupPause();
    } else {
      setupRunning();
    } //viewer.clock.shouldAnimate = !isInPause;
    //pausedButtonState();

  }

  function vistaInicial() {
    camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(1.5455, 41.698, 450000),
      duration: 4
    });
    Cesium.Hash(viewer);
  }

  function vistaInicialPro() {
    camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(3.354784, 35.288017, 15202342),
      duration: 0,
      complete: function complete() {
        setTimeout(function () {
          camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(1.5455, 41.698, 450000),
            orientation: {
              heading: Cesium.Math.toRadians(360),
              pitch: Cesium.Math.toRadians(-90.0) //tilt

            },
            easingFunction: Cesium.EasingFunction.LINEAR_NONE
          }); // addToponims();
        }, 1000);
      }
    });
    Cesium.Hash(viewer);
    viewer.clock.onTick.addEventListener(function (clock) {
      // This example uses time offsets from the start to identify which parts need loading.
      var timeOffset = Cesium.JulianDate.secondsDifference(clock.currentTime, clock.startTime); //console.info("timeOffset",timeOffset);

      if (labelsDatasource && timeOffset > 1 && timeOffset < 100) {
        endLoading();
      }

      if (viewer.clock.currentTime == viewer.clock.stopTime) {
        console.info("final ruta");
      }
    });
  } //ends controls animacio


  function enviarPeticio(url) {
    return regeneratorRuntime.async(function enviarPeticio$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.warn(url);
            return _context.abrupt("return", fetch(url).then(function (response) {
              return response.json();
            }).then(function (data) {
              console.warn("Respuesta", data);
              return data;
            })["catch"](function (error) {
              console.warn("Error", error);
              alert("Error peticion");
              return null;
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    });
  }
}); // end ready

},{"./utils":2}],2:[function(require,module,exports){
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

},{}]},{},[1]);

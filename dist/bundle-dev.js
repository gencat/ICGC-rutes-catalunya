(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.htmlEvents=void 0;var htmlEvents=function(){var e=function(){return $(".ui.fluid.dropdown").dropdown({maxSelections:3}),$(".label.ui.dropdown").dropdown(),$(".no.label.ui.dropdown").dropdown({useLabels:!1}),$(".ui.button").on("click",function(){$(".ui.dropdown").dropdown("restore defaults")}),$(".ui.button.fileRequest").click(function(){var e=$(this).attr("data-gpx");window.location=e}),$("#infobox").hide(),jQuery("#menuIcon").on("click",function(){t(),$("toggle").removeClass("disabled")}),$(".headerInfo").on("click",function(){$(".ui.modal.info").modal("show")}),$("#infoallausid").on("click",function(){$(".ui.modal.allaus").modal("show")}),$("#infolandslidesid").on("click",function(){$(".ui.modal.esllavissades").modal("show")}),!0},t=function(){$("#sideBarOptions").sidebar("setting","transition","overlay").sidebar("toggle")},n=function(){$("#sideBt").show(),$("#mySidepanel").show(),0===$("#mySidepanel").width()?(document.getElementById("mySidepanel").style.width="350px",document.getElementById("sideBt").style.left="350px"):(document.getElementById("mySidepanel").style.width="0px",document.getElementById("sideBt").style.left="0px")},o=function(){document.getElementById("mySidepanel").style.width="0px",document.getElementById("sideBt").style.left="0px"},d=function(e){e?$("#sideBt").show():(document.getElementById("mySidepanel").style.width="0px",document.getElementById("sideBt").style.left="0px",$("#sideBt").hide())};return{dropDownBT:e,toggleSideBar:t,toolBarAnimation:function(){$("#sideBt").on("click",function(){n()})},openSidePanel:n,collapseSidePanel:o,sidePanelStatus:d}}();exports.htmlEvents=htmlEvents;
},{}],2:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.rutes=void 0;var rutes=function(){return{checkOptions:function(e){var t={color:Cesium.Color.YELLOW,font:"10px Helvetica",far:1500};return"curs fluv."!=e&&"hidr."!=e||(t.color=Cesium.Color.AQUA,t.font="9px Helvetica",t.far=3e3),"orogr."!=e&&"serra"!=e&&"coll"!=e||(t.color=Cesium.Color.PALEGREEN,t.font="12px Helvetica",t.far=5e3),"cim"==e&&(t.color=Cesium.Color.SPRINGGREEN,t.font="13px Helvetica",t.far=6e3),t},addTemplateInfoElevation:function(e,t,o){try{var a=""==o.description?"ruta usuari":"Inici "+o.description;$("#nomRutaH").html(o.title),$("#llocRutaH").html(a),$("#elevation-div").show(),$("#sideBt").show(),t.clear(),t.load(e),t.on("eledata_added",function(e){var t=e.track_info,o=parseInt(t.elevation_max)-parseInt(t.elevation_min);$("#totlen").html("Distància: ".concat(t.distance.toFixed(2),' km <i class="arrows alternate horizontal right ui icon">')),$("#desni").html("Desnivell: ".concat(o,' m <i class="arrows alternate vertical ui icon">')),$("#maxele").html("Altitud màxima: ".concat(parseInt(t.elevation_max),' m <i class="level up alternate ui icon">')),$("#minele").html("Altitud mínima: ".concat(parseInt(t.elevation_min),' m <i class="level down alternate ui icon">'))})}catch(e){console.info(e)}}}}();exports.rutes=rutes;
},{}],3:[function(require,module,exports){
"use strict";var ev=require("./events.js"),ut=require("./utils.js"),fn=require("./functions.js"),ly=require("./layers.js"),west=2,south=42,east=2.1,north=42.2,trackDataSource=null,trackGeoJSON=null,CAPA_ALLAUS=null,CAPA_TOPONIMS=null,CAPA_RISCGEOLOGIC=null,CAPA_CARRETERS=null,CAPA_CIMS=null,caixaCerca,MAPSTATE={base:ly.BaseMaps.orto,gpx:null,description:null,title:null,meta:null,layers:[]},fakeMap,controlElevation,imPro,urlApp="http://localhost:9966",dev=!0,viewer,rutaIniciada=!1,isInPause=!0,labelsDatasource,capturer,baseParam=$.url().param("base"),gpxParam=$.url().param("gpx"),layersParam=[$.url().param("layers")],coordsParam=$.url().param("coords");$(window.document).ready(function(){function e(e){if(labelsDatasource)return labelsDatasource.show=e,!0}function a(a){m(),$("#controls").show(),$("#pausa").hide(),$("#loading").hide(),e(!1),rutaIniciada=!1,MAPSTATE.gpx=a.id,MAPSTATE.title=a.title,MAPSTATE.description=a.description,r(a.id,!1)}function r(e,a,r){var i=a?r:"dist/data/rutes/".concat(e),o=omnivore.gpx(i,null).on("ready",function(e){if($(".ui.button.fileRequest").attr("data-gpx",i),$(".ui.button.fileRequest").attr("href",i),$(".enllaca").prop("name",i),$("#uploadButton").prop("name",i),$("#elevationbutton").prop("elevation",trackGeoJSON),$("#infobox").hide(),$("#elevation-div").hide(),$("#elevation-div").removeData(trackGeoJSON),viewer.dataSources.contains(P)){viewer.dataSources.remove(P),$("#distanceLabel").text("↦ ".concat((0).toFixed(2)," km")),$("#desnivellPositiuLabel").text("↑ ".concat((0).toFixed(2)," m")),$("#desnivellNegatiuLabel").text("↓ ".concat((0).toFixed(2)," m"))}P=new Cesium.CzmlDataSource;trackGeoJSON={type:"FeatureCollection",features:[]},trackGeoJSON.features.push(ut.tmUtils.extractSingleLineString(this.toGeoJSON())),viewer.dataSources.add(Cesium.GeoJsonDataSource.load(trackGeoJSON,{stroke:Cesium.Color.RED,fill:Cesium.Color.BURLYWOOD,strokeWidth:1,markerSymbol:"?"})),t(trackGeoJSON,controlElevation,MAPSTATE),viewer.dataSources.add(P.load(ut.tmUtils.buildCZMLForTrack(trackGeoJSON,o,"marker"))).then(function(e){trackDataSource=e,ev.htmlEvents.openSidePanel(),viewer.flyTo(e,{duration:2}),setTimeout(function(){MAPSTATE.base.indexOf("orto")},2e3),viewer.clock.shouldAnimate=!1})})}function t(e,a,r){fn.rutes.addTemplateInfoElevation(e,a,r),$("#closeSearch").show(),$("#lupaSearch").hide(),$("#resultsCerca").removeClass("visible"),$("#resultsCerca").addClass("hidden"),$("#resultsCerca").hide()}function i(e){MAPSTATE.base=e,$("#baseLayers a").removeClass("active"),ly.fnLayers.removeBaseLayers(y,2),ly.fnLayers.addBaseLayers(y,e)}function o(){jQuery("#play i").removeClass("circular pause icon"),jQuery("#play i").addClass("circular play icon"),l(!1)}function n(){jQuery("#play i").removeClass("circular play icon"),jQuery("#play i").addClass("circular pause icon"),l()}function s(){var e=0,a=null,r=0,t=0,i=null;$("#infobox").show(),viewer.clock.currentTime.equals(viewer.clock.stopTime),viewer.clock.currentTime=Cesium.JulianDate.fromIso8601(trackGeoJSON.features[0].properties.coordTimes[0]),viewer.clock.onTick.addEventListener(function(o){var n=trackDataSource.entities.getById("track").position.getValue(o.currentTime),s=Cesium.Ellipsoid.WGS84.cartesianToCartographic(n),l=s.height;if(a&&a!=n){var c=Cesium.Cartesian3.distance(n,a);if(e+=c,i<l){r+=l-i}if(i>=l){var u=l-i;t+=Math.abs(u)}e>0&&($("#distanceLabel").html("".concat(e/1e3," km")),$("#distanceLabel").text("↦ ".concat((e/1e3).toFixed(2)," km")),$("#desnivellPositiuLabel").text("↑ ".concat(r.toFixed(2)," m")),$("#desnivellNegatiuLabel").text("↓ ".concat(t.toFixed(2)," m")))}a=n,i=l;var d=Cesium.JulianDate.secondsDifference(o.currentTime,o.startTime);labelsDatasource&&d>1&&d<100&&A(),viewer.clock.currentTime,viewer.clock.stopTime}),viewer.trackedEntity=trackDataSource.entities.getById("track"),trackDataSource.entities.getById("track").billboard.show=!0,viewer.clock.shouldAnimate=!0,c()}function l(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];viewer.clock.shouldAnimate=e}function c(){capturer.start()}function u(){capturer.stop()}function d(){window.open(capturer.save("ruta.webm"))}function A(){$("#loading").hide()}function m(){viewer.clock.shouldAnimate=!1,viewer.trackedEntity=void 0,viewer.trackedEntity=void 0,viewer.dataSources.removeAll()}function C(e){e?o():n()}function v(){baseParam&&""!==baseParam&&baseParam!==ly.BaseMaps.orto&&i(baseParam),gpxParam&&""!==gpxParam!==null?($("#textSearch").focus(),$("#textSearch").val(gpxParam),$(".ui.search").search("setting",{maxResults:0}),$(".ui.search").search("query",gpxParam)):$(".ui.search").search("setting",{maxResults:7}),""!==layersParam&&null!==layersParam!==void 0&&(void 0===layersParam[0]||(layersParam[0].includes("ALLAUS")&&(CAPA_ALLAUS=CAPA_ALLAUS||y.addImageryProvider(ly.LayersAllausICGC),CAPA_ALLAUS.show=!0,MAPSTATE.layers.push("CAPA_ALLAUS"),$("#allausToggle").attr("checked",!0)),layersParam[0].includes("TOPONIMS")&&(CAPA_TOPONIMS=CAPA_TOPONIMS||y.addImageryProvider(ly.LayerToponimsICGC),CAPA_TOPONIMS.show=!0,MAPSTATE.layers.push("CAPA_TOPONIMS"),$("#toponimsToggle").attr("checked",!0)),layersParam[0].includes("RISCGEOLOGIC")&&(CAPA_RISCGEOLOGIC=CAPA_RISCGEOLOGIC||y.addImageryProvider(ly.LayerRiscGeologicICGC),CAPA_RISCGEOLOGIC.show=!0,CAPA_RISCGEOLOGIC.alpha=.5,MAPSTATE.layers.push("CAPA_RISCGEOLOGIC"),$("#landslidesToggle").attr("checked",!0)),layersParam[0].includes("CARRETERS")&&(CAPA_CARRETERS=CAPA_CARRETERS||y.addImageryProvider(ly.LayerCarreteresICGC),CAPA_CARRETERS.show=!0,MAPSTATE.layers.push("CAPA_CARRETERS"),$("#carreteresToggle").attr("checked",!0))))}ev.htmlEvents.dropDownBT(),Cesium.Camera.DEFAULT_VIEW_RECTANGLE=Cesium.Rectangle.fromDegrees(west,south,east,north),Cesium.Resource.supportsImageBitmapOptions=function(){return Cesium.when.resolve(!1)},viewer=new Cesium.Viewer("map",{imageryProvider:ly.LayerOrtoEsri,timeline:!1,fullscreenElement:!1,fullscreenButton:!1,navigationHelpButton:!1,scene3DOnly:!0,baseLayerPicker:!1,homeButton:!1,infoBox:!0,sceneModePicker:!1,shouldAnimate:!1,animation:!1,geocoder:!1,vrButton:!1,showRenderLoopErrors:!1,useDefaultRenderLoop:!0,orderIndependentTranslucency:!0,sceneMode:Cesium.SceneMode.SCENE3D,terrainProvider:ly.LayerTerrenyICGC});var h=viewer.scene,p=viewer.scene.camera,y=viewer.scene.imageryLayers;y.addImageryProvider(ly.LayerOrtoICGC),ly.LayerTerrenyICGC.errorEvent.addEventListener(function(e){e.retry=!1}),viewer.scene.logarithmicDepthBuffer=!1,h.globe.depthTestingAgainstTerrain=!0,viewer.scene.globe.enableLighting=!0,viewer.scene.fog.enabled=!0,viewer.scene.fog.density=2e-4,viewer.scene.fog.screenSpaceErrorFactor=2,function(){FileReaderJS.setupInput(document.getElementById("uploadbutton"),{readAsDefault:"DataURL",on:{load:function(a,t){var i=t,o=$(i).attr("name");null!=i&&($("#controls").show(),$("#pausa").hide(),$("#loading").hide(),$("#prompt").hide(),e(!1),rutaIniciada=!1,$("#uploadButton").prop("name",i),viewer.dataSources.removeAll(),MAPSTATE.gpx=i,MAPSTATE.title=i,MAPSTATE.description="",r(o,!0,a.target.result))}}}),$("#selectRutes").on("change",function(){null!=this.value&&($("#controls").show(),$("#pausa").hide(),$("#loading").hide(),e(!1),rutaIniciada=!1,r(this.value,!1),$("#elevationbutton").load(this.value))}),jQuery("#play").on("click",function(){ev.htmlEvents.collapseSidePanel(),jQuery("#savevideobutton").css("opacity",1),jQuery("#savevideobutton").attr("title","Descarrega video de l'animació"),rutaIniciada?(isInPause=!isInPause,C(isInPause)):(e(!0),jQuery("#loading").show(1e3,function(e){rutaIniciada=!0,s(),$("#loading").hide(),jQuery("#play i").removeClass("circular play icon"),jQuery("#play i").addClass("circular pause icon")}),isInPause=!1)}),ev.htmlEvents.toolBarAnimation(),$("#playpausa").on("click",function(){C(!1),$("#pausa").show(),$("#loading").hide(),$("#play").hide()}),$("#stopvideobutton").on("click",function(){u()}),$("#savevideobutton").on("click",function(){1==$("#savevideobutton").css("opacity")&&(u(),d())}),$("#home").on("click",function(){rutaIniciada&&(s().oldCoord=null,s().distance=0,s().oldElev=null,s().desnivellPositiu=0,s().desnivellNegatiu=0,jQuery("#play i").removeClass("circular play icon"),jQuery("#play i").addClass("circular pause icon"))}),$("#closeSearch").on("click",function(){o(),viewer.dataSources.contains(P)&&viewer.dataSources.removeAll(),$("#infobox").hide(),$("#controls").hide(),$("#closeSearch").hide(),$("#lupaSearch").show(),$("#textSearch").val(""),ev.htmlEvents.sidePanelStatus(!1),MAPSTATE.gpx=null,$(".ui.search").search("setting",{maxResults:7}),jQuery("#savevideobutton").css("opacity",.5),jQuery("#savevideobutton").attr("title","Inicia l'animació per poder descarregar el video")}),caixaCerca=$(".ui.search").search({source:rutesJSON,minCharacters:2,searchFields:["title","description","id"],maxResults:0,fullTextSearch:"exact",onResults:function(e){1===e.results.length&&a(e.results[0])},onSelect:function(e){null!=e.id&&a(e)}}),$("#allausToggle").change(function(){if($(this).is(":checked"))CAPA_ALLAUS=CAPA_ALLAUS||y.addImageryProvider(ly.LayersAllausICGC),CAPA_ALLAUS.show=!0,MAPSTATE.layers.push("CAPA_ALLAUS");else{CAPA_ALLAUS.show=!1;for(var e=0;e<MAPSTATE.layers.length;e++)"CAPA_ALLAUS"===MAPSTATE.layers[e]&&MAPSTATE.layers.splice(e,1)}}),$("#toponimsToggle").change(function(){if($(this).is(":checked"))CAPA_TOPONIMS=CAPA_TOPONIMS||y.addImageryProvider(ly.LayerToponimsICGC),CAPA_TOPONIMS.show=!0,MAPSTATE.layers.push("CAPA_TOPONIMS");else{CAPA_TOPONIMS.show=!1;for(var e=0;e<MAPSTATE.layers.length;e++)"CAPA_TOPONIMS"===MAPSTATE.layers[e]&&MAPSTATE.layers.splice(e,1)}}),$("#landslidesToggle").change(function(){if($(this).is(":checked"))CAPA_RISCGEOLOGIC=CAPA_RISCGEOLOGIC||y.addImageryProvider(ly.LayerRiscGeologicICGC),CAPA_RISCGEOLOGIC.show=!0,CAPA_RISCGEOLOGIC.alpha=.5,MAPSTATE.layers.push("CAPA_RISCGEOLOGIC");else{CAPA_RISCGEOLOGIC.show=!1;for(var e=0;e<MAPSTATE.layers.length;e++)"CAPA_RISCGEOLOGIC"===MAPSTATE.layers[e]&&MAPSTATE.layers.splice(e,1)}}),$("#carreteresToggle").change(function(){if($(this).is(":checked"))CAPA_CARRETERS=CAPA_CARRETERS||y.addImageryProvider(ly.LayerCarreteresICGC),CAPA_CARRETERS.show=!0,MAPSTATE.layers.push("CAPA_CARRETERS");else{CAPA_CARRETERS.show=!1;for(var e=0;e<MAPSTATE.layers.length;e++)"CAPA_CARRETERS"===MAPSTATE.layers[e]&&MAPSTATE.layers.splice(e,1)}}),$("#gpslocation").on("click",function(){function e(e){p.flyTo({destination:Cesium.Cartesian3.fromDegrees(e.coords.longitude,e.coords.latitude,2e3),duration:0}),viewer.entities.add({position:Cesium.Cartesian3.fromDegrees(e.coords.longitude,e.coords.latitude),billboard:{image:"dist/css/img/room-24px.svg",scale:1.5,color:new Cesium.Color(30,97,148,1)}})}var a=document.getElementById("gpslocation");navigator.geolocation?navigator.geolocation.getCurrentPosition(e):a.innerHTML="Geolocation is not supported by this browser."}),$(".enllaca").on("click",function(){var e=window.location.href.valueOf(),a=e.split("#"),r=MAPSTATE.gpx;if("string"==typeof r||r instanceof String)var t=r?r.replace(".gpx",""):"";else var t="";var i="".concat(a[0],"?base=").concat(MAPSTATE.base,"&gpx=").concat(t,"&layers=").concat(MAPSTATE.layers,"&#").concat(a[1]);$("#urlMap").val(encodeURI(i.valueOf()));var o='<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="'.concat(i.replace("#","\\#"),'" ></iframe>');$("#iframeMap").html(o),$("#enllacamodal").modal("show")})}(),function(){var e={theme:"lightblue-theme",detached:!0,elevationDiv:"#elevation-div",width:jQuery("#elevation-div").outerWidth(),height:"150",autohide:!1,collapsed:!0,position:"bottom",followMarker:!1,imperial:!1,reverseCoords:!1,summary:"multiline"};fakeMap=new L.Map("fakemap"),controlElevation=L.control.elevation(e).addTo(fakeMap)}(),function(){null===Cesium.Hash.decode(location.hash)&&p.flyTo({destination:Cesium.Cartesian3.fromDegrees(1.698078,42.211228,45e4),duration:0,complete:function(){setTimeout(function(){p.flyTo({destination:Cesium.Cartesian3.fromDegrees(1.743685,42.225577,3121),orientation:{heading:Cesium.Math.toRadians(295),pitch:Cesium.Math.toRadians(-22)},easingFunction:Cesium.EasingFunction.LINEAR_NONE})},1e3)}}),Cesium.Hash(viewer),v()}(),function(){$("#iniciaHome").on("click",function(){ev.htmlEvents.toggleSideBar()}),$("#baseLayers a").on("click",function(e){i(e.target.id)})}();var P;capturer=new CanvasRecorder(viewer.scene.canvas)});
},{"./events.js":1,"./functions.js":2,"./layers.js":4,"./utils.js":5}],4:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.fnLayers=exports.BaseMaps=exports.LayerCarreteresICGC=exports.LayerRiscGeologicICGC=exports.LayerToponimsICGC=exports.LayersAllausICGC=exports.LayerSlopeICGC=exports.LayerCimsICGC=exports.LayerTerrenyICGC=exports.LayerTopoOSM=exports.LayerTopoClassicICGC=exports.LayerTopoICGC=exports.LayerRelleuICGC=exports.LayerGeologicICGC=exports.LayerOrtoICGC=exports.LayerRelleuEsri=exports.LayerOrtoEsri=void 0;var URL_ORTO_ICGC="https://geoserveis.icgc.cat/icc_mapesmultibase/noutm/wmts/orto/GRID3857/{z}/{x}/{y}.png",URL_TOPOGRAFIC_ICGC="https://geoserveis.icgc.cat/icc_mapesmultibase/noutm/wmts/topo/GRID3857/{z}/{x}/{y}.jpeg",URL_Carreteres="https://tilemaps.icgc.cat/mapfactory/wmts/hibrida_total/CAT3857/{z}/{x}/{y}.png",URL_TOPO_ICGC="https://tilemaps.icgc.cat/mapfactory/wmts/topo_suau/CAT3857/{z}/{x}/{y}.png",URL_TOPO_OSM="https://tilemaps.icgc.cat/mapfactory/wmts/osm_suau/CAT3857_15/{z}/{x}/{y}.png",URL_GEOL_ICGC="https://tilemaps.icgc.cat/mapfactory/wmts/geologia/MON3857NW/{z}/{x}/{y}.png",URL_RELLEU_ICGC="https://tilemaps.icgc.cat/mapfactory/wmts/relleu/CAT3857/{z}/{x}/{y}.png",URL_RELLEU_ESRI="https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer?",URL_ADMIN="https://tilemaps.icgc.cat/mapfactory/wmts/limits/CAT3857/{z}/{x}/{y}.png",URL_TOPONIM="https://tilemaps.icgc.cat/mapfactory/wmts/toponimia/CAT3857/{z}/{x}/{y}.png",URL_TERRENY="https://tilemaps.icgc.cat/terrenys/demextes",URL_ORTO_ESRI="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer?",URL_CIMS_ICGC="https://geoserveis.icgc.cat/icc_100cims/wms/service?",URL_SLOPE_ICGC="https://geoserveis.icgc.cat/icgc_mp20p5m/wms/service?",URL_ALLAUS_ICGC="https://siurana.icgc.cat/geoserver/nivoallaus/wms?",URL_RISC_GEOLOGIC="https://geoserveis.icgc.cat/serveis/catalunya/riscos-geologics/wms?",LayerOrtoEsri=new Cesium.ArcGisMapServerImageryProvider({url:URL_ORTO_ESRI,enablePickFeatures:!1,maximumLevel:10,credit:"ESRI"});exports.LayerOrtoEsri=LayerOrtoEsri;var LayerRelleuEsri=new Cesium.ArcGisMapServerImageryProvider({url:URL_RELLEU_ESRI,enablePickFeatures:!1,maximumLevel:10,credit:"ESRI"});exports.LayerRelleuEsri=LayerRelleuEsri;var LayerOrtoICGC=new Cesium.UrlTemplateImageryProvider({url:URL_ORTO_ICGC,enablePickFeatures:!1,maximumLevel:18,credit:"Institut Cartogràfic i Geològic de Catalunya"});exports.LayerOrtoICGC=LayerOrtoICGC;var LayerGeologicICGC=new Cesium.UrlTemplateImageryProvider({url:URL_GEOL_ICGC,enablePickFeatures:!1,maximumLevel:14,credit:"Institut Cartogràfic i Geològic de Catalunya"});exports.LayerGeologicICGC=LayerGeologicICGC;var LayerRelleuICGC=new Cesium.UrlTemplateImageryProvider({url:URL_RELLEU_ICGC,enablePickFeatures:!1,maximumLevel:18,credit:"Institut Cartogràfic i Geològic de Catalunya"});exports.LayerRelleuICGC=LayerRelleuICGC;var LayerTopoICGC=new Cesium.UrlTemplateImageryProvider({url:URL_TOPO_ICGC,enablePickFeatures:!1,maximumLevel:18,credit:"Institut Cartogràfic i Geològic de Catalunya"});exports.LayerTopoICGC=LayerTopoICGC;var LayerTopoClassicICGC=new Cesium.UrlTemplateImageryProvider({url:URL_TOPOGRAFIC_ICGC,enablePickFeatures:!1,maximumLevel:18,credit:"Institut Cartogràfic i Geològic de Catalunya"});exports.LayerTopoClassicICGC=LayerTopoClassicICGC;var LayerTopoOSM=new Cesium.UrlTemplateImageryProvider({url:URL_TOPO_OSM,enablePickFeatures:!1,maximumLevel:12,credit:"OpenStreetMap Contributors"});exports.LayerTopoOSM=LayerTopoOSM;var LayerTerrenyICGC=new Cesium.CesiumTerrainProvider({url:URL_TERRENY});exports.LayerTerrenyICGC=LayerTerrenyICGC;var LayerCimsICGC=new Cesium.WebMapServiceImageryProvider({url:URL_CIMS_ICGC,layers:"0",enablePickFeatures:!0,showEntitiesLabels:!0,credit:new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),parameters:{transparent:"true",format:"image/png"}});exports.LayerCimsICGC=LayerCimsICGC;var LayerSlopeICGC=new Cesium.WebMapServiceImageryProvider({url:URL_SLOPE_ICGC,layers:"MP20P5M_PA",enablePickFeatures:!0,showEntitiesLabels:!0,credit:new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),parameters:{transparent:"true",format:"image/png"}});exports.LayerSlopeICGC=LayerSlopeICGC;var LayersAllausICGC=new Cesium.WebMapServiceImageryProvider({url:URL_ALLAUS_ICGC,layers:"observacions",enablePickFeatures:!0,showEntitiesLabels:!0,credit:new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),parameters:{transparent:"true",format:"image/png"}});exports.LayersAllausICGC=LayersAllausICGC;var LayerToponimsICGC=new Cesium.UrlTemplateImageryProvider({url:URL_TOPONIM,enablePickFeatures:!1,maximumLevel:18,credit:"Institut Cartogràfic i Geològic de Catalunya"});exports.LayerToponimsICGC=LayerToponimsICGC;var LayerRiscGeologicICGC=new Cesium.WebMapServiceImageryProvider({url:URL_RISC_GEOLOGIC,layers:"G6PE_PA",enablePickFeatures:!0,showEntitiesLabels:!0,credit:new Cesium.Credit("Institut Cartogràfic i Geològic de Catalunya"),parameters:{transparent:"true",format:"image/png"}});exports.LayerRiscGeologicICGC=LayerRiscGeologicICGC;var LayerCarreteresICGC=new Cesium.UrlTemplateImageryProvider({url:URL_Carreteres,enablePickFeatures:!1,maximumLevel:18,credit:"Institut Cartogràfic i Geològic de Catalunya"});exports.LayerCarreteresICGC=LayerCarreteresICGC;var BaseMaps={orto:"ortofotoMenu",topo:"topographicMenu",topoClassic:"topoClassicMenu",relleu:"relleuMenu",geologic:"geologicMenu"};exports.BaseMaps=BaseMaps;var fnLayers=function(){var e=function(e,r){r===BaseMaps.orto?(e.addImageryProvider(LayerOrtoEsri,0),e._layers[0].alpha=.5,e.addImageryProvider(LayerOrtoICGC,1)):r===BaseMaps.topo?(e.addImageryProvider(LayerTopoOSM,0),e._layers[0].alpha=.5,e.addImageryProvider(LayerTopoICGC,1)):r===BaseMaps.topoClassic?(e.addImageryProvider(LayerRelleuICGC,0),e.addImageryProvider(LayerTopoClassicICGC,1),e._layers[1].alpha=.7):r===BaseMaps.relleu?(e.addImageryProvider(LayerRelleuEsri,0),e._layers[0].alpha=.5,e.addImageryProvider(LayerRelleuICGC,1)):r===BaseMaps.geologic&&(e.addImageryProvider(LayerRelleuICGC,0),e.addImageryProvider(LayerGeologicICGC,1),e._layers[1].alpha=.5)};return{removeBaseLayers:function(e,r){try{1===r?e.remove(e.get(1)):(e.remove(e.get(1)),e.remove(e.get(0)))}catch(e){return console.info(e),!1}},addBaseLayers:e}}();exports.fnLayers=fnLayers;
},{}],5:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.tmUtils=void 0;var tmUtils=function(){var e={TRAIL_MARKER_COLOR:"7A5C1E",WAYPOINT_COLOR:"#3887BE",INSIDE_TRACK_COLOR:[255,0,0,205],TRACK_COLOR:[255,0,0,100],SELECTED_THUMBNAIL_COLOR:"#00FF00",FAVORITE:"&#10029;",KEYCODE_ESC:27,KEYCODE_SPACE:32,CAMERA_OFFSET:6e3,FLY_TIME:2,MIN_SAMPLE_DISTANCE:10,AUTOPLAY_DELAY:5e3},r=function(e){for(var r=new Array(e.geometry.coordinates.length),t=0;t<e.geometry.coordinates.length-1;t++){var o=t<5?t+1:5;r[t]=0;for(var i=t-o+1;i<=t;i++)r[t]+=e.geometry.coordinates[i][2];r[t]=r[t]/o}return r};return{calculateTrackMetrics:function(e,t){if(!Array.isArray(e.geometry.coordinates))return null;for(var o=0,i=0,s=0,a=e.geometry.coordinates[0][2],n=r(e),c=0;c<e.geometry.coordinates.length-1;c++)o+=L.latLng(e.geometry.coordinates[c][1],e.geometry.coordinates[c][0]).distanceTo(L.latLng(e.geometry.coordinates[c+1][1],e.geometry.coordinates[c+1][0])),n[c]<n[c+1]&&(i+=n[c+1]-n[c]),e.geometry.coordinates[c][2]>s&&(s=e.geometry.coordinates[c][2]),e.geometry.coordinates[c][2]<a&&(a=e.geometry.coordinates[c][2]);return e.geometry.coordinates[c][2]>s&&(s=e.geometry.coordinates[c][2]),e.geometry.coordinates[c][2]<a&&(a=e.geometry.coordinates[c][2]),[t[0]+o/1e3,t[1]+i,Math.max(t[2],s),Math.min(t[3],a)]},isValidEmail:function(e){return/\S+@\S+\.\S+/.test(e)},buildCZMLForTrack:function(r,t,o){function i(e,t){c[1].position.cartographicDegrees.push(r.features[e].properties.coordTimes[t]),c[1].position.cartographicDegrees.push(r.features[e].geometry.coordinates[t][0]),c[1].position.cartographicDegrees.push(r.features[e].geometry.coordinates[t][1]),c[1].position.cartographicDegrees.push(r.features[e].geometry.coordinates[t][2])}for(var s=0,a=r.features.length;a--;)"LineString"!==r.features[a].geometry.type?r.features.splice(a,1):(!Array.isArray(r.features[a].geometry.coordinates)||r.features[a].geometry.coordinates[0].length<3)&&r.features.splice(a,1);var n=new Date("2019-06-18 12:00:00");for(s=0;s<r.features.length;s++)for(r.features[s].properties.coordTimes=[],a=0;a<r.features[s].geometry.coordinates.length;a++)r.features[s].properties.coordTimes.push(n.toISOString()),n.setSeconds(n.getSeconds()+10);var c=[{id:"document",name:"Track CZML",version:"1.0",clock:{interval:"",currentTime:"",multiplier:100,range:"CLAMPED",step:"SYSTEM_CLOCK_MULTIPLIER"}},{id:"track",availability:r.features[0].properties.coordTimes[0]+"/"+r.features[0].properties.coordTimes[r.features[0].properties.coordTimes.length-1],path:{material:{polylineOutline:{color:{rgba:e.INSIDE_TRACK_COLOR},outlineColor:{rgba:e.TRACK_COLOR},outlineWidth:5}},width:7,leadTime:0,resolution:60,clampToground:!0},billboard:{image:"./dist/img/logo.png",verticalOrigin:"BOTTOM",scale:.5,show:!1},position:{cartographicDegrees:[]},viewFrom:{cartesian:[0,-1e3,2e3]}},{id:"trailhead",billboard:{image:"./dist/img/logo.png",verticalOrigin:"BOTTOM",scale:.5},position:{cartographicDegrees:[r.features[0].geometry.coordinates[0][0],r.features[0].geometry.coordinates[0][1],r.features[0].geometry.coordinates[0][2]]}},{id:"nw",description:"anchor fly",point:{color:{rgba:[0,0,0,0]}},position:{cartographicDegrees:[t.getBounds().getWest(),t.getBounds().getNorth(),r.features[0].geometry.coordinates[0][2]]}},{id:"se",description:"anchor fly",point:{color:{rgba:[0,0,0,0]}},position:{cartographicDegrees:[t.getBounds().getEast(),t.getBounds().getSouth(),r.features[0].geometry.coordinates[0][2]]}}],g=0;for(s=0;s<r.features.length;s++)for(g=0,a=0;a<r.features[s].geometry.coordinates.length;a++)if(0===a)i(s,a);else{var p=Cesium.Cartesian3.fromDegrees(r.features[s].geometry.coordinates[g][0],r.features[s].geometry.coordinates[g][1],r.features[s].geometry.coordinates[g][2]),u=Cesium.Cartesian3.fromDegrees(r.features[s].geometry.coordinates[a][0],r.features[s].geometry.coordinates[a][1],r.features[s].geometry.coordinates[a][2]);Cesium.Cartesian3.distance(u,p)>e.MIN_SAMPLE_DISTANCE&&(i(s,a),g=a)}return c[0].clock.interval=r.features[0].properties.coordTimes[0]+"/"+r.features[s-1].properties.coordTimes[g],c[0].clock.currentTime=r.features[s-1].properties.coordTimes[g],c[0].clock.multiplier=function(e){return e>36e3?e/360:e<12e3?e/120:100}((new Date(r.features[s-1].properties.coordTimes[g]).getTime()-new Date(r.features[0].properties.coordTimes[0]).getTime())/1e3),c[1].availability=r.features[0].properties.coordTimes[0]+"/"+r.features[s-1].properties.coordTimes[g],c},buildCZMLForGeoTags:function(r,t,o){function i(e,r,t,o){var i=document.createElement("canvas");i.width=r,i.height=r;var s=i.getContext("2d");return s.lineWidth=t,s.strokeStyle=o,s.drawImage(e,0,0,r,r),s.strokeRect(0,0,r,r),i}function s(r,t,o){var s=$.Deferred();return o.onload=function(){a.push({id:"pic-"+r,billboard:{image:i(o,44,4,"#fff"),verticalOrigin:"BOTTOM",show:!0},position:{cartographicRadians:t}}),a.push({id:"picS-"+r,billboard:{image:i(o,44,4,e.SELECTED_THUMBNAIL_COLOR),verticalOrigin:"BOTTOM",show:!1},position:{cartographicRadians:t}}),s.resolve()},s.promise()}for(var a=[{id:"document",name:"GeoTags CZML",version:"1.0"}],n=[],c=[],g=0;g<r.trackPhotos.length;g++)r.trackPhotos[g].picLatLng&&(c.push(Cesium.Cartographic.fromDegrees(r.trackPhotos[g].picLatLng[1],r.trackPhotos[g].picLatLng[0])),n.push(g));n.length>0&&Cesium.sampleTerrainMostDetailed(t.terrainProvider,c).then(function(e){for(var t=[],i=0;i<n.length;i++){var c=new Image;c.src="data:image/jpeg;base64,"+r.trackPhotos[n[i]].picThumbBlob,t.push(s(r.trackPhotos[n[i]].picIndex,[e[i].longitude,e[i].latitude,e[i].height+50],c))}$.when.apply(this,t).then(function(){o(a)})})},extractSingleLineString:function(e){for(var r={geometry:{coordinates:[],type:"LineString"},properties:{coordTimes:[]},type:"Feature"},t=0;t<e.features.length;t++)if(e.features[t].properties.time&&!r.properties.time&&(r.properties.time=e.features[t].properties.time),"LineString"===e.features[t].geometry.type)e.features[t].geometry.coordinates[0].length>=3&&(r.geometry.coordinates.push.apply(r.geometry.coordinates,e.features[t].geometry.coordinates),e.features[t].properties.coordTimes&&r.properties.coordTimes.push.apply(r.properties.coordTimes,e.features[t].properties.coordTimes));else if("MultiLineString"===e.features[t].geometry.type)for(var o=0;o<e.features[t].geometry.coordinates.length;o++)e.features[t].geometry.coordinates[o][0].length>=3&&r.geometry.coordinates.push.apply(r.geometry.coordinates,e.features[t].geometry.coordinates[o]),e.features[t].properties.coordTimes[o]&&r.properties.coordTimes.push.apply(r.properties.coordTimes,e.features[t].properties.coordTimes[o]);return r}}}();exports.tmUtils=tmUtils;
},{}]},{},[3])


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

'use strict';

const URL_ORTO_ICGC = "https://geoserveis.icgc.cat/icc_mapesmultibase/noutm/wmts/orto/GRID3857/{z}/{x}/{y}.png";
const URL_TOPOGRAFIC_ICGC = "https://geoserveis.icgc.cat/icc_mapesmultibase/noutm/wmts/topo/GRID3857/{z}/{x}/{y}.jpeg";
const URL_Carreteres = "https://tilemaps.icgc.cat/mapfactory/wmts/hibrida_total/CAT3857/{z}/{x}/{y}.png";
const URL_TOPO_ICGC = "https://tilemaps.icgc.cat/mapfactory/wmts/topo_suau/CAT3857/{z}/{x}/{y}.png";
const URL_TOPO_OSM = "https://tilemaps.icgc.cat/mapfactory/wmts/osm_suau/CAT3857_15/{z}/{x}/{y}.png";
const URL_GEOL_ICGC = "https://tilemaps.icgc.cat/mapfactory/wmts/geologia/MON3857NW/{z}/{x}/{y}.png";
const URL_RELLEU_ICGC = "https://tilemaps.icgc.cat/mapfactory/wmts/relleu/CAT3857/{z}/{x}/{y}.png";
const URL_RELLEU_ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer?"
const URL_ADMIN = "https://tilemaps.icgc.cat/mapfactory/wmts/limits/CAT3857/{z}/{x}/{y}.png";
const URL_TOPONIM = "https://tilemaps.icgc.cat/mapfactory/wmts/toponimia/CAT3857/{z}/{x}/{y}.png";
const URL_TERRENY = "https://tilemaps.icgc.cat/terrenys/demextes";
const URL_ORTO_ESRI = "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer?";
const URL_CIMS_ICGC = "https://geoserveis.icgc.cat/icc_100cims/wms/service?";
const URL_SLOPE_ICGC = "https://geoserveis.icgc.cat/icgc_mp20p5m/wms/service?";
const URL_ALLAUS_ICGC = "https://siurana.icgc.cat/geoserver/nivoallaus/wms?";
const URL_RISC_GEOLOGIC = "https://geoserveis.icgc.cat/icgc_riscgeologic/wms/service?";

export const LayerOrtoEsri = new Cesium.ArcGisMapServerImageryProvider({
    url: URL_ORTO_ESRI,
    enablePickFeatures: false,
    maximumLevel: 10,
    credit: "ESRI"
});


export const LayerRelleuEsri = new Cesium.ArcGisMapServerImageryProvider({
    url: URL_RELLEU_ESRI,
    enablePickFeatures: false,
    maximumLevel: 10,
    credit: "ESRI"
});
export const LayerOrtoICGC = new Cesium.UrlTemplateImageryProvider({
    url: URL_ORTO_ICGC,
    enablePickFeatures: false,
    maximumLevel: 18,
    credit: "Institut Cartogràfic i Geològic de Catalunya"

});

export const LayerGeologicICGC = new Cesium.UrlTemplateImageryProvider({
    url: URL_GEOL_ICGC,
    enablePickFeatures: false,
    maximumLevel: 14,
    credit: "Institut Cartogràfic i Geològic de Catalunya"

});


export const LayerRelleuICGC = new Cesium.UrlTemplateImageryProvider({
    url: URL_RELLEU_ICGC,
    enablePickFeatures: false,
    maximumLevel: 18,
    credit: "Institut Cartogràfic i Geològic de Catalunya"

});

export const LayerTopoICGC = new Cesium.UrlTemplateImageryProvider({
    url: URL_TOPO_ICGC,
    enablePickFeatures: false,
    maximumLevel: 18,
    credit: "Institut Cartogràfic i Geològic de Catalunya"

});

export const LayerTopoClassicICGC = new Cesium.UrlTemplateImageryProvider({
    url: URL_TOPOGRAFIC_ICGC,
    enablePickFeatures: false,
    maximumLevel: 18,
    credit: "Institut Cartogràfic i Geològic de Catalunya"

});

export const LayerTopoOSM = new Cesium.UrlTemplateImageryProvider({
    url: URL_TOPO_OSM,
    enablePickFeatures: false,
    maximumLevel: 12,
    credit: "OpenStreetMap Contributors"

});

export const LayerTerrenyICGC = new Cesium.CesiumTerrainProvider({
    url: URL_TERRENY
});

export const LayerCimsICGC = new Cesium.WebMapServiceImageryProvider({
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

export const LayerSlopeICGC = new Cesium.WebMapServiceImageryProvider({
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

export const LayersAllausICGC = new Cesium.WebMapServiceImageryProvider({
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

export const LayerToponimsICGC = new Cesium.UrlTemplateImageryProvider({
    url: URL_TOPONIM,
    enablePickFeatures: false,
    maximumLevel: 18,
    credit: "Institut Cartogràfic i Geològic de Catalunya"

});

export const LayerRiscGeologicICGC = new Cesium.WebMapServiceImageryProvider({
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

export const LayerCarreteresICGC = new Cesium.UrlTemplateImageryProvider({
    url: URL_Carreteres,
    enablePickFeatures: false,
    maximumLevel: 18,
    credit: "Institut Cartogràfic i Geològic de Catalunya"
});


export const BaseMaps = {

    orto: "ortofotoMenu",
    topo: "topographicMenu",
    topoClassic: "topoClassicMenu",
    relleu: "relleuMenu",
    geologic: "geologicMenu"

};

export const fnLayers = (function () {

    var addBaseLayers = function (ImageryLayers, id) {

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

        } else {


        }

    }

    var removeBaseLayers = function (ImageryLayers, num) {
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


    }


    return {
        removeBaseLayers: removeBaseLayers,
        addBaseLayers: addBaseLayers
    };
})();

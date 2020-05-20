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

(function() {

  var encode = function(viewer) {
    var camera = viewer.camera;
    return "#" + [
      Cesium.Math.toDegrees(camera.positionCartographic.latitude).toFixed(6),
      Cesium.Math.toDegrees(camera.positionCartographic.longitude).toFixed(6),
      Math.round(camera.positionCartographic.height),
      Math.round(Cesium.Math.toDegrees(camera.heading)),
      Math.round(Cesium.Math.toDegrees(camera.pitch))
    ].join("/");
  };

  var decode = function(hash) {
    var flag = true;
    var param = [];
    hash.replace(/^#/, "").split("/").forEach(function(v) {
      var a = parseFloat(v);
      if (isNaN(a)) flag = false;
      param.push(a);
    });
    return flag && param.length === 5 ? {
      destination: Cesium.Cartesian3.fromDegrees(param[1], param[0], param[2]),
      orientation: {
        heading: Cesium.Math.toRadians(param[3]),
        pitch: Cesium.Math.toRadians(param[4]),
        roll: 0
      }
    } : null;
  };

  Cesium.Hash = function(viewer) {
    var obj = decode(location.hash);
    if (obj) viewer.camera.setView(obj);
    var lastHash = location.hash;
    viewer.camera.moveEnd.addEventListener(function() {
      location.hash = lastHash = encode(viewer);
    }, viewer);
    window.addEventListener("hashchange", function() {
      if (lastHash !== location.hash) {
        var obj = decode(location.hash);
        if (obj) viewer.camera.setView(obj);
      }
    });
  };
  Cesium.Hash.encode = encode;
  Cesium.Hash.decode = decode;

})();

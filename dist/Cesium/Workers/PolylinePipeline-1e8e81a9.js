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

/**
 * Cesium - https://github.com/AnalyticalGraphicsInc/cesium
 *
 * Copyright 2011-2020 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/AnalyticalGraphicsInc/cesium/blob/master/LICENSE.md for full licensing details.
 */
define(["exports","./when-0488ac89","./Check-78ca6843","./Math-8a4c9da1","./Cartesian2-cc1e6450","./Transforms-fa4f10bc","./IntersectionTests-12255a09","./Plane-466db411","./EllipsoidRhumbLine-9e95354f","./EllipsoidGeodesic-80f12c10"],function(a,T,e,w,P,y,v,m,A,r){"use strict";var E={numberOfPoints:function(a,e,r){var t=P.Cartesian3.distance(a,e);return Math.ceil(t/r)},numberOfPointsRhumbLine:function(a,e,r){var t=Math.pow(a.longitude-e.longitude,2)+Math.pow(a.latitude-e.latitude,2);return Math.ceil(Math.sqrt(t/(r*r)))}},o=new P.Cartographic;E.extractHeights=function(a,e){for(var r=a.length,t=new Array(r),i=0;i<r;i++){var n=a[i];t[i]=e.cartesianToCartographic(n,o).height}return t};var S=new y.Matrix4,b=new P.Cartesian3,R=new P.Cartesian3,M=new m.Plane(P.Cartesian3.UNIT_X,0),D=new P.Cartesian3,G=new m.Plane(P.Cartesian3.UNIT_X,0),x=new P.Cartesian3,N=new P.Cartesian3,I=[];function k(a,e,r){var t,i=I;if(i.length=a,e===r){for(t=0;t<a;t++)i[t]=e;return i}var n=(r-e)/a;for(t=0;t<a;t++){var o=e+t*n;i[t]=o}return i}var V=new P.Cartographic,L=new P.Cartographic,_=new P.Cartesian3,O=new P.Cartesian3,B=new P.Cartesian3,U=new r.EllipsoidGeodesic,z=new A.EllipsoidRhumbLine;function X(a,e,r,t,i,n,o,s){var c=t.scaleToGeodeticSurface(a,O),l=t.scaleToGeodeticSurface(e,B),u=E.numberOfPoints(a,e,r),h=t.cartesianToCartographic(c,V),f=t.cartesianToCartographic(l,L),C=k(u,i,n);U.setEndPoints(h,f);var g=U.surfaceDistance/u,p=s;h.height=i;var d=t.cartographicToCartesian(h,_);P.Cartesian3.pack(d,o,p),p+=3;for(var v=1;v<u;v++){var m=U.interpolateUsingSurfaceDistance(v*g,L);m.height=C[v],d=t.cartographicToCartesian(m,_),P.Cartesian3.pack(d,o,p),p+=3}return p}function q(a,e,r,t,i,n,o,s){var c=t.scaleToGeodeticSurface(a,O),l=t.scaleToGeodeticSurface(e,B),u=t.cartesianToCartographic(c,V),h=t.cartesianToCartographic(l,L),f=E.numberOfPointsRhumbLine(u,h,r),C=k(f,i,n);z.ellipsoid.equals(t)||(z=new A.EllipsoidRhumbLine(void 0,void 0,t)),z.setEndPoints(u,h);var g=z.surfaceDistance/f,p=s;u.height=i;var d=t.cartographicToCartesian(u,_);P.Cartesian3.pack(d,o,p),p+=3;for(var v=1;v<f;v++){var m=z.interpolateUsingSurfaceDistance(v*g,L);m.height=C[v],d=t.cartographicToCartesian(m,_),P.Cartesian3.pack(d,o,p),p+=3}return p}E.wrapLongitude=function(a,e){var r=[],t=[];if(T.defined(a)&&0<a.length){e=T.defaultValue(e,y.Matrix4.IDENTITY);var i=y.Matrix4.inverseTransformation(e,S),n=y.Matrix4.multiplyByPoint(i,P.Cartesian3.ZERO,b),o=P.Cartesian3.normalize(y.Matrix4.multiplyByPointAsVector(i,P.Cartesian3.UNIT_Y,R),R),s=m.Plane.fromPointNormal(n,o,M),c=P.Cartesian3.normalize(y.Matrix4.multiplyByPointAsVector(i,P.Cartesian3.UNIT_X,D),D),l=m.Plane.fromPointNormal(n,c,G),u=1;r.push(P.Cartesian3.clone(a[0]));for(var h=r[0],f=a.length,C=1;C<f;++C){var g=a[C];if(m.Plane.getPointDistance(l,h)<0||m.Plane.getPointDistance(l,g)<0){var p=v.IntersectionTests.lineSegmentPlane(h,g,s,x);if(T.defined(p)){var d=P.Cartesian3.multiplyByScalar(o,5e-9,N);m.Plane.getPointDistance(s,h)<0&&P.Cartesian3.negate(d,d),r.push(P.Cartesian3.add(p,d,new P.Cartesian3)),t.push(u+1),P.Cartesian3.negate(d,d),r.push(P.Cartesian3.add(p,d,new P.Cartesian3)),u=1}}r.push(P.Cartesian3.clone(a[C])),u++,h=g}t.push(u)}return{positions:r,lengths:t}},E.generateArc=function(a){T.defined(a)||(a={});var e=a.positions,r=e.length,t=T.defaultValue(a.ellipsoid,P.Ellipsoid.WGS84),i=T.defaultValue(a.height,0),n=y.isArray(i);if(r<1)return[];if(1===r){var o=t.scaleToGeodeticSurface(e[0],O);if(0!==(i=n?i[0]:i)){var s=t.geodeticSurfaceNormal(o,_);P.Cartesian3.multiplyByScalar(s,i,s),P.Cartesian3.add(o,s,o)}return[o.x,o.y,o.z]}var c=a.minDistance;if(!T.defined(c)){var l=T.defaultValue(a.granularity,w.CesiumMath.RADIANS_PER_DEGREE);c=w.CesiumMath.chordLength(l,t.maximumRadius)}var u,h=0;for(u=0;u<r-1;u++)h+=E.numberOfPoints(e[u],e[u+1],c);var f=3*(h+1),C=new Array(f),g=0;for(u=0;u<r-1;u++){g=X(e[u],e[u+1],c,t,n?i[u]:i,n?i[u+1]:i,C,g)}I.length=0;var p=e[r-1],d=t.cartesianToCartographic(p,V);d.height=n?i[r-1]:i;var v=t.cartographicToCartesian(d,_);return P.Cartesian3.pack(v,C,f-3),C};var W=new P.Cartographic,Y=new P.Cartographic;E.generateRhumbArc=function(a){T.defined(a)||(a={});var e=a.positions,r=e.length,t=T.defaultValue(a.ellipsoid,P.Ellipsoid.WGS84),i=T.defaultValue(a.height,0),n=y.isArray(i);if(r<1)return[];if(1===r){var o=t.scaleToGeodeticSurface(e[0],O);if(0!==(i=n?i[0]:i)){var s=t.geodeticSurfaceNormal(o,_);P.Cartesian3.multiplyByScalar(s,i,s),P.Cartesian3.add(o,s,o)}return[o.x,o.y,o.z]}var c,l,u=T.defaultValue(a.granularity,w.CesiumMath.RADIANS_PER_DEGREE),h=0,f=t.cartesianToCartographic(e[0],W);for(c=0;c<r-1;c++)l=t.cartesianToCartographic(e[c+1],Y),h+=E.numberOfPointsRhumbLine(f,l,u),f=P.Cartographic.clone(l,W);var C=3*(h+1),g=new Array(C),p=0;for(c=0;c<r-1;c++){p=q(e[c],e[c+1],u,t,n?i[c]:i,n?i[c+1]:i,g,p)}I.length=0;var d=e[r-1],v=t.cartesianToCartographic(d,V);v.height=n?i[r-1]:i;var m=t.cartographicToCartesian(v,_);return P.Cartesian3.pack(m,g,C-3),g},E.generateCartesianArc=function(a){for(var e=E.generateArc(a),r=e.length/3,t=new Array(r),i=0;i<r;i++)t[i]=P.Cartesian3.unpack(e,3*i);return t},E.generateCartesianRhumbArc=function(a){for(var e=E.generateRhumbArc(a),r=e.length/3,t=new Array(r),i=0;i<r;i++)t[i]=P.Cartesian3.unpack(e,3*i);return t},a.PolylinePipeline=E});

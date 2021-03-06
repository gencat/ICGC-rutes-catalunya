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
define(["exports","./when-0488ac89","./Check-78ca6843","./Cartesian2-cc1e6450","./defineProperties-c6a70625","./Transforms-fa4f10bc","./IntersectionTests-12255a09","./Plane-466db411"],function(e,C,n,x,t,s,o,a){"use strict";function y(e,n,t){this.minimum=x.Cartesian3.clone(C.defaultValue(e,x.Cartesian3.ZERO)),this.maximum=x.Cartesian3.clone(C.defaultValue(n,x.Cartesian3.ZERO)),t=C.defined(t)?x.Cartesian3.clone(t):x.Cartesian3.midpoint(this.minimum,this.maximum,new x.Cartesian3),this.center=t}y.fromPoints=function(e,n){if(C.defined(n)||(n=new y),!C.defined(e)||0===e.length)return n.minimum=x.Cartesian3.clone(x.Cartesian3.ZERO,n.minimum),n.maximum=x.Cartesian3.clone(x.Cartesian3.ZERO,n.maximum),n.center=x.Cartesian3.clone(x.Cartesian3.ZERO,n.center),n;for(var t=e[0].x,i=e[0].y,a=e[0].z,r=e[0].x,s=e[0].y,o=e[0].z,m=e.length,c=1;c<m;c++){var l=e[c],u=l.x,d=l.y,f=l.z;t=Math.min(u,t),r=Math.max(u,r),i=Math.min(d,i),s=Math.max(d,s),a=Math.min(f,a),o=Math.max(f,o)}var h=n.minimum;h.x=t,h.y=i,h.z=a;var p=n.maximum;return p.x=r,p.y=s,p.z=o,n.center=x.Cartesian3.midpoint(h,p,n.center),n},y.clone=function(e,n){if(C.defined(e))return C.defined(n)?(n.minimum=x.Cartesian3.clone(e.minimum,n.minimum),n.maximum=x.Cartesian3.clone(e.maximum,n.maximum),n.center=x.Cartesian3.clone(e.center,n.center),n):new y(e.minimum,e.maximum,e.center)},y.equals=function(e,n){return e===n||C.defined(e)&&C.defined(n)&&x.Cartesian3.equals(e.center,n.center)&&x.Cartesian3.equals(e.minimum,n.minimum)&&x.Cartesian3.equals(e.maximum,n.maximum)};var m=new x.Cartesian3;y.intersectPlane=function(e,n){m=x.Cartesian3.subtract(e.maximum,e.minimum,m);var t=x.Cartesian3.multiplyByScalar(m,.5,m),i=n.normal,a=t.x*Math.abs(i.x)+t.y*Math.abs(i.y)+t.z*Math.abs(i.z),r=x.Cartesian3.dot(e.center,i)+n.distance;return 0<r-a?s.Intersect.INSIDE:r+a<0?s.Intersect.OUTSIDE:s.Intersect.INTERSECTING},y.prototype.clone=function(e){return y.clone(this,e)},y.prototype.intersectPlane=function(e){return y.intersectPlane(this,e)},y.prototype.equals=function(e){return y.equals(this,e)};var r=new s.Cartesian4;function i(e,n){e=(n=C.defaultValue(n,x.Ellipsoid.WGS84)).scaleToGeodeticSurface(e);var t=s.Transforms.eastNorthUpToFixedFrame(e,n);this._ellipsoid=n,this._origin=e,this._xAxis=x.Cartesian3.fromCartesian4(s.Matrix4.getColumn(t,0,r)),this._yAxis=x.Cartesian3.fromCartesian4(s.Matrix4.getColumn(t,1,r));var i=x.Cartesian3.fromCartesian4(s.Matrix4.getColumn(t,2,r));this._plane=a.Plane.fromPointNormal(e,i)}t.defineProperties(i.prototype,{ellipsoid:{get:function(){return this._ellipsoid}},origin:{get:function(){return this._origin}},plane:{get:function(){return this._plane}},xAxis:{get:function(){return this._xAxis}},yAxis:{get:function(){return this._yAxis}},zAxis:{get:function(){return this._plane.normal}}});var c=new y;i.fromPoints=function(e,n){return new i(y.fromPoints(e,c).center,n)};var l=new o.Ray,u=new x.Cartesian3;i.prototype.projectPointOntoPlane=function(e,n){var t=l;t.origin=e,x.Cartesian3.normalize(e,t.direction);var i=o.IntersectionTests.rayPlane(t,this._plane,u);if(C.defined(i)||(x.Cartesian3.negate(t.direction,t.direction),i=o.IntersectionTests.rayPlane(t,this._plane,u)),C.defined(i)){var a=x.Cartesian3.subtract(i,this._origin,i),r=x.Cartesian3.dot(this._xAxis,a),s=x.Cartesian3.dot(this._yAxis,a);return C.defined(n)?(n.x=r,n.y=s,n):new x.Cartesian2(r,s)}},i.prototype.projectPointsOntoPlane=function(e,n){C.defined(n)||(n=[]);for(var t=0,i=e.length,a=0;a<i;a++){var r=this.projectPointOntoPlane(e[a],n[t]);C.defined(r)&&(n[t]=r,t++)}return n.length=t,n},i.prototype.projectPointToNearestOnPlane=function(e,n){C.defined(n)||(n=new x.Cartesian2);var t=l;t.origin=e,x.Cartesian3.clone(this._plane.normal,t.direction);var i=o.IntersectionTests.rayPlane(t,this._plane,u);C.defined(i)||(x.Cartesian3.negate(t.direction,t.direction),i=o.IntersectionTests.rayPlane(t,this._plane,u));var a=x.Cartesian3.subtract(i,this._origin,i),r=x.Cartesian3.dot(this._xAxis,a),s=x.Cartesian3.dot(this._yAxis,a);return n.x=r,n.y=s,n},i.prototype.projectPointsToNearestOnPlane=function(e,n){C.defined(n)||(n=[]);var t=e.length;n.length=t;for(var i=0;i<t;i++)n[i]=this.projectPointToNearestOnPlane(e[i],n[i]);return n};var d=new x.Cartesian3;i.prototype.projectPointOntoEllipsoid=function(e,n){C.defined(n)||(n=new x.Cartesian3);var t=this._ellipsoid,i=this._origin,a=this._xAxis,r=this._yAxis,s=d;return x.Cartesian3.multiplyByScalar(a,e.x,s),n=x.Cartesian3.add(i,s,n),x.Cartesian3.multiplyByScalar(r,e.y,s),x.Cartesian3.add(n,s,n),t.scaleToGeocentricSurface(n,n),n},i.prototype.projectPointsOntoEllipsoid=function(e,n){var t=e.length;C.defined(n)?n.length=t:n=new Array(t);for(var i=0;i<t;++i)n[i]=this.projectPointOntoEllipsoid(e[i],n[i]);return n},e.AxisAlignedBoundingBox=y,e.EllipsoidTangentPlane=i});

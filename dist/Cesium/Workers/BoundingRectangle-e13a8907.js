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
 * Cesium - https://github.com/CesiumGS/cesium
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
 * See https://github.com/CesiumGS/cesium/blob/master/LICENSE.md for full licensing details.
 */
define(["exports","./when-a55a8a4c","./Check-bc1d37d9","./Cartesian2-8c9f79ed","./Transforms-7a81c8c2"],function(t,f,e,r,a){"use strict";function x(t,e,n,i){this.x=f.defaultValue(t,0),this.y=f.defaultValue(e,0),this.width=f.defaultValue(n,0),this.height=f.defaultValue(i,0)}x.packedLength=4,x.pack=function(t,e,n){return n=f.defaultValue(n,0),e[n++]=t.x,e[n++]=t.y,e[n++]=t.width,e[n]=t.height,e},x.unpack=function(t,e,n){return e=f.defaultValue(e,0),f.defined(n)||(n=new x),n.x=t[e++],n.y=t[e++],n.width=t[e++],n.height=t[e],n},x.fromPoints=function(t,e){if(f.defined(e)||(e=new x),!f.defined(t)||0===t.length)return e.x=0,e.y=0,e.width=0,e.height=0,e;for(var n=t.length,i=t[0].x,h=t[0].y,r=t[0].x,a=t[0].y,d=1;d<n;d++){var u=t[d],c=u.x,o=u.y;i=Math.min(c,i),r=Math.max(c,r),h=Math.min(o,h),a=Math.max(o,a)}return e.x=i,e.y=h,e.width=r-i,e.height=a-h,e};var d=new a.GeographicProjection,u=new r.Cartographic,c=new r.Cartographic;x.fromRectangle=function(t,e,n){if(f.defined(n)||(n=new x),!f.defined(t))return n.x=0,n.y=0,n.width=0,n.height=0,n;var i=(e=f.defaultValue(e,d)).project(r.Rectangle.southwest(t,u)),h=e.project(r.Rectangle.northeast(t,c));return r.Cartesian2.subtract(h,i,h),n.x=i.x,n.y=i.y,n.width=h.x,n.height=h.y,n},x.clone=function(t,e){if(f.defined(t))return f.defined(e)?(e.x=t.x,e.y=t.y,e.width=t.width,e.height=t.height,e):new x(t.x,t.y,t.width,t.height)},x.union=function(t,e,n){f.defined(n)||(n=new x);var i=Math.min(t.x,e.x),h=Math.min(t.y,e.y),r=Math.max(t.x+t.width,e.x+e.width),a=Math.max(t.y+t.height,e.y+e.height);return n.x=i,n.y=h,n.width=r-i,n.height=a-h,n},x.expand=function(t,e,n){n=x.clone(t,n);var i=e.x-n.x,h=e.y-n.y;return i>n.width?n.width=i:i<0&&(n.width-=i,n.x=e.x),h>n.height?n.height=h:h<0&&(n.height-=h,n.y=e.y),n},x.intersect=function(t,e){var n=t.x,i=t.y,h=e.x,r=e.y;return n>h+e.width||n+t.width<h||i+t.height<r||i>r+e.height?a.Intersect.OUTSIDE:a.Intersect.INTERSECTING},x.equals=function(t,e){return t===e||f.defined(t)&&f.defined(e)&&t.x===e.x&&t.y===e.y&&t.width===e.width&&t.height===e.height},x.prototype.clone=function(t){return x.clone(this,t)},x.prototype.intersect=function(t){return x.intersect(this,t)},x.prototype.equals=function(t){return x.equals(this,t)},t.BoundingRectangle=x});

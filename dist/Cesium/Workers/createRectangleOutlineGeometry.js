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
define(["./when-a55a8a4c","./Check-bc1d37d9","./Math-73a8bd13","./Cartesian2-8c9f79ed","./Transforms-7a81c8c2","./RuntimeError-7c184ac0","./WebGLConstants-4c11ee5f","./ComponentDatatype-c2c50230","./GeometryAttribute-f9641809","./GeometryAttributes-1c7ce91d","./IndexDatatype-486e7786","./GeometryOffsetAttribute-9ecab91f","./EllipsoidRhumbLine-cddfa697","./PolygonPipeline-c12287cd","./RectangleGeometryLibrary-a5152115"],function(h,e,y,c,m,t,i,E,A,G,R,b,a,P,w){"use strict";var _=new m.BoundingSphere,v=new m.BoundingSphere,L=new c.Cartesian3,C=new c.Rectangle;function D(e,t){var i=e._ellipsoid,a=t.height,r=t.width,n=t.northCap,o=t.southCap,l=a,u=2,s=0,c=4;n&&(--u,--l,s+=1,c-=2),o&&(--u,--l,s+=1,c-=2),s+=u*r+2*l-c;var p,d=new Float64Array(3*s),f=0,g=0,h=L;if(n)w.RectangleGeometryLibrary.computePosition(t,i,!1,g,0,h),d[f++]=h.x,d[f++]=h.y,d[f++]=h.z;else for(p=0;p<r;p++)w.RectangleGeometryLibrary.computePosition(t,i,!1,g,p,h),d[f++]=h.x,d[f++]=h.y,d[f++]=h.z;for(p=r-1,g=1;g<a;g++)w.RectangleGeometryLibrary.computePosition(t,i,!1,g,p,h),d[f++]=h.x,d[f++]=h.y,d[f++]=h.z;if(g=a-1,!o)for(p=r-2;0<=p;p--)w.RectangleGeometryLibrary.computePosition(t,i,!1,g,p,h),d[f++]=h.x,d[f++]=h.y,d[f++]=h.z;for(p=0,g=a-2;0<g;g--)w.RectangleGeometryLibrary.computePosition(t,i,!1,g,p,h),d[f++]=h.x,d[f++]=h.y,d[f++]=h.z;for(var y=d.length/3*2,m=R.IndexDatatype.createTypedArray(d.length/3,y),b=0,_=0;_<d.length/3-1;_++)m[b++]=_,m[b++]=_+1;m[b++]=d.length/3-1,m[b++]=0;var v=new A.Geometry({attributes:new G.GeometryAttributes,primitiveType:A.PrimitiveType.LINES});return v.attributes.position=new A.GeometryAttribute({componentDatatype:E.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:d}),v.indices=m,v}function p(e){var t=(e=h.defaultValue(e,h.defaultValue.EMPTY_OBJECT)).rectangle,i=h.defaultValue(e.granularity,y.CesiumMath.RADIANS_PER_DEGREE),a=h.defaultValue(e.ellipsoid,c.Ellipsoid.WGS84),r=h.defaultValue(e.rotation,0),n=h.defaultValue(e.height,0),o=h.defaultValue(e.extrudedHeight,n);this._rectangle=c.Rectangle.clone(t),this._granularity=i,this._ellipsoid=a,this._surfaceHeight=Math.max(n,o),this._rotation=r,this._extrudedHeight=Math.min(n,o),this._offsetAttribute=e.offsetAttribute,this._workerName="createRectangleOutlineGeometry"}p.packedLength=c.Rectangle.packedLength+c.Ellipsoid.packedLength+5,p.pack=function(e,t,i){return i=h.defaultValue(i,0),c.Rectangle.pack(e._rectangle,t,i),i+=c.Rectangle.packedLength,c.Ellipsoid.pack(e._ellipsoid,t,i),i+=c.Ellipsoid.packedLength,t[i++]=e._granularity,t[i++]=e._surfaceHeight,t[i++]=e._rotation,t[i++]=e._extrudedHeight,t[i]=h.defaultValue(e._offsetAttribute,-1),t};var d=new c.Rectangle,f=c.Ellipsoid.clone(c.Ellipsoid.UNIT_SPHERE),g={rectangle:d,ellipsoid:f,granularity:void 0,height:void 0,rotation:void 0,extrudedHeight:void 0,offsetAttribute:void 0};p.unpack=function(e,t,i){t=h.defaultValue(t,0);var a=c.Rectangle.unpack(e,t,d);t+=c.Rectangle.packedLength;var r=c.Ellipsoid.unpack(e,t,f);t+=c.Ellipsoid.packedLength;var n=e[t++],o=e[t++],l=e[t++],u=e[t++],s=e[t];return h.defined(i)?(i._rectangle=c.Rectangle.clone(a,i._rectangle),i._ellipsoid=c.Ellipsoid.clone(r,i._ellipsoid),i._surfaceHeight=o,i._rotation=l,i._extrudedHeight=u,i._offsetAttribute=-1===s?void 0:s,i):(g.granularity=n,g.height=o,g.rotation=l,g.extrudedHeight=u,g.offsetAttribute=-1===s?void 0:s,new p(g))};var x=new c.Cartographic;return p.createGeometry=function(e){var t,i,a=e._rectangle,r=e._ellipsoid,n=w.RectangleGeometryLibrary.computeOptions(a,e._granularity,e._rotation,0,C,x);if(!y.CesiumMath.equalsEpsilon(a.north,a.south,y.CesiumMath.EPSILON10)&&!y.CesiumMath.equalsEpsilon(a.east,a.west,y.CesiumMath.EPSILON10)){var o,l=e._surfaceHeight,u=e._extrudedHeight;if(!y.CesiumMath.equalsEpsilon(l,u,0,y.CesiumMath.EPSILON2)){if(t=function(e,t){var i=e._surfaceHeight,a=e._extrudedHeight,r=e._ellipsoid,n=a,o=i,l=D(e,t),u=t.height,s=t.width,c=P.PolygonPipeline.scaleToGeodeticHeight(l.attributes.position.values,o,r,!1),p=c.length,d=new Float64Array(2*p);d.set(c);var f=P.PolygonPipeline.scaleToGeodeticHeight(l.attributes.position.values,n,r);d.set(f,p),l.attributes.position.values=d;var g=t.northCap,h=t.southCap,y=4;g&&--y,h&&--y;var m=2*(d.length/3+y),b=R.IndexDatatype.createTypedArray(d.length/3,m);p=d.length/6;for(var _,v=0,E=0;E<p-1;E++)b[v++]=E,b[v++]=E+1,b[v++]=E+p,b[v++]=E+p+1;if(b[v++]=p-1,b[v++]=0,b[v++]=p+p-1,b[v++]=p,b[v++]=0,b[v++]=p,g)_=u-1;else{var A=s-1;b[v++]=A,b[v++]=A+p,_=s+u-2}if(b[v++]=_,b[v++]=_+p,!h){var G=s+_-1;b[v++]=G,b[v]=G+p}return l.indices=b,l}(e,n),h.defined(e._offsetAttribute)){var s=t.attributes.position.values.length/3,c=new Uint8Array(s);c=e._offsetAttribute===b.GeometryOffsetAttribute.TOP?b.arrayFill(c,1,0,s/2):(o=e._offsetAttribute===b.GeometryOffsetAttribute.NONE?0:1,b.arrayFill(c,o)),t.attributes.applyOffset=new A.GeometryAttribute({componentDatatype:E.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:c})}var p=m.BoundingSphere.fromRectangle3D(a,r,l,v),d=m.BoundingSphere.fromRectangle3D(a,r,u,_);i=m.BoundingSphere.union(p,d)}else{if((t=D(e,n)).attributes.position.values=P.PolygonPipeline.scaleToGeodeticHeight(t.attributes.position.values,l,r,!1),h.defined(e._offsetAttribute)){var f=t.attributes.position.values.length,g=new Uint8Array(f/3);o=e._offsetAttribute===b.GeometryOffsetAttribute.NONE?0:1,b.arrayFill(g,o),t.attributes.applyOffset=new A.GeometryAttribute({componentDatatype:E.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:g})}i=m.BoundingSphere.fromRectangle3D(a,r,l)}return new A.Geometry({attributes:t.attributes,indices:t.indices,primitiveType:A.PrimitiveType.LINES,boundingSphere:i,offsetAttribute:e._offsetAttribute})}},function(e,t){return h.defined(t)&&(e=p.unpack(e,t)),e._ellipsoid=c.Ellipsoid.clone(e._ellipsoid),e._rectangle=c.Rectangle.clone(e._rectangle),p.createGeometry(e)}});

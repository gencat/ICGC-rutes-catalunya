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
define(["./when-a55a8a4c","./Check-bc1d37d9","./Math-73a8bd13","./Cartesian2-8c9f79ed","./Transforms-7a81c8c2","./RuntimeError-7c184ac0","./WebGLConstants-4c11ee5f","./ComponentDatatype-c2c50230","./GeometryAttribute-f9641809","./GeometryAttributes-1c7ce91d","./AttributeCompression-fbcb3321","./GeometryPipeline-24d3be03","./EncodedCartesian3-11d9c783","./IndexDatatype-486e7786","./IntersectionTests-3bb891b7","./Plane-a6a20716","./VertexFormat-e1477d0a","./arrayRemoveDuplicates-9c727c83","./BoundingRectangle-e13a8907","./EllipsoidTangentPlane-7f2f6dd6","./EllipsoidRhumbLine-cddfa697","./PolygonPipeline-c12287cd","./PolylineVolumeGeometryLibrary-94a0865b","./EllipsoidGeodesic-4c7a7786","./PolylinePipeline-a7e2c020"],function(c,e,i,u,G,t,n,A,R,D,r,I,a,O,o,l,g,s,p,d,y,S,m,h,f){"use strict";var v={};function B(e,t){c.defined(v[e])||(v[e]=!0,console.warn(c.defaultValue(t,e)))}function b(e){var t=(e=c.defaultValue(e,c.defaultValue.EMPTY_OBJECT)).polylinePositions,n=e.shapePositions;this._positions=t,this._shape=n,this._ellipsoid=u.Ellipsoid.clone(c.defaultValue(e.ellipsoid,u.Ellipsoid.WGS84)),this._cornerType=c.defaultValue(e.cornerType,m.CornerType.ROUNDED),this._vertexFormat=g.VertexFormat.clone(c.defaultValue(e.vertexFormat,g.VertexFormat.DEFAULT)),this._granularity=c.defaultValue(e.granularity,i.CesiumMath.RADIANS_PER_DEGREE),this._workerName="createPolylineVolumeGeometry";var r=1+t.length*u.Cartesian3.packedLength;r+=1+n.length*u.Cartesian2.packedLength,this.packedLength=r+u.Ellipsoid.packedLength+g.VertexFormat.packedLength+2}B.geometryOutlines="Entity geometry outlines are unsupported on terrain. Outlines will be disabled. To enable outlines, disable geometry terrain clamping by explicitly setting height to 0.",B.geometryZIndex="Entity geometry with zIndex are unsupported when height or extrudedHeight are defined.  zIndex will be ignored",B.geometryHeightReference="Entity corridor, ellipse, polygon or rectangle with heightReference must also have a defined height.  heightReference will be ignored",B.geometryExtrudedHeightReference="Entity corridor, ellipse, polygon or rectangle with extrudedHeightReference must also have a defined extrudedHeight.  extrudedHeightReference will be ignored",b.pack=function(e,t,n){var r;n=c.defaultValue(n,0);var i=e._positions,a=i.length;for(t[n++]=a,r=0;r<a;++r,n+=u.Cartesian3.packedLength)u.Cartesian3.pack(i[r],t,n);var o=e._shape;for(a=o.length,t[n++]=a,r=0;r<a;++r,n+=u.Cartesian2.packedLength)u.Cartesian2.pack(o[r],t,n);return u.Ellipsoid.pack(e._ellipsoid,t,n),n+=u.Ellipsoid.packedLength,g.VertexFormat.pack(e._vertexFormat,t,n),n+=g.VertexFormat.packedLength,t[n++]=e._cornerType,t[n]=e._granularity,t};var E=u.Ellipsoid.clone(u.Ellipsoid.UNIT_SPHERE),P=new g.VertexFormat,_={polylinePositions:void 0,shapePositions:void 0,ellipsoid:E,vertexFormat:P,cornerType:void 0,granularity:void 0};b.unpack=function(e,t,n){var r;t=c.defaultValue(t,0);var i=e[t++],a=new Array(i);for(r=0;r<i;++r,t+=u.Cartesian3.packedLength)a[r]=u.Cartesian3.unpack(e,t);i=e[t++];var o=new Array(i);for(r=0;r<i;++r,t+=u.Cartesian2.packedLength)o[r]=u.Cartesian2.unpack(e,t);var l=u.Ellipsoid.unpack(e,t,E);t+=u.Ellipsoid.packedLength;var s=g.VertexFormat.unpack(e,t,P);t+=g.VertexFormat.packedLength;var p=e[t++],d=e[t];return c.defined(n)?(n._positions=a,n._shape=o,n._ellipsoid=u.Ellipsoid.clone(l,n._ellipsoid),n._vertexFormat=g.VertexFormat.clone(s,n._vertexFormat),n._cornerType=p,n._granularity=d,n):(_.polylinePositions=a,_.shapePositions=o,_.cornerType=p,_.granularity=d,new b(_))};var x=new p.BoundingRectangle;return b.createGeometry=function(e){var t=e._positions,n=s.arrayRemoveDuplicates(t,u.Cartesian3.equalsEpsilon),r=e._shape;if(r=m.PolylineVolumeGeometryLibrary.removeDuplicatesFromShape(r),!(n.length<2||r.length<3)){S.PolygonPipeline.computeWindingOrder2D(r)===S.WindingOrder.CLOCKWISE&&r.reverse();var i=p.BoundingRectangle.fromPoints(r,x);return function(e,t,n,r){var i=new D.GeometryAttributes;r.position&&(i.position=new R.GeometryAttribute({componentDatatype:A.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:e}));var a,o,l,s,p,d,c=t.length,u=e.length/3,g=(u-2*c)/(2*c),y=S.PolygonPipeline.triangulate(t),m=(g-1)*c*6+2*y.length,h=O.IndexDatatype.createTypedArray(u,m),f=2*c,v=0;for(a=0;a<g-1;a++){for(o=0;o<c-1;o++)d=(l=2*o+a*c*2)+f,p=(s=l+1)+f,h[v++]=s,h[v++]=l,h[v++]=p,h[v++]=p,h[v++]=l,h[v++]=d;p=(s=(l=2*c-2+a*c*2)+1)+f,d=l+f,h[v++]=s,h[v++]=l,h[v++]=p,h[v++]=p,h[v++]=l,h[v++]=d}if(r.st||r.tangent||r.bitangent){var b,E,P=new Float32Array(2*u),_=1/(g-1),x=1/n.height,k=n.height/2,C=0;for(a=0;a<g;a++){for(b=a*_,E=x*(t[0].y+k),P[C++]=b,P[C++]=E,o=1;o<c;o++)E=x*(t[o].y+k),P[C++]=b,P[C++]=E,P[C++]=b,P[C++]=E;E=x*(t[0].y+k),P[C++]=b,P[C++]=E}for(o=0;o<c;o++)b=0,E=x*(t[o].y+k),P[C++]=b,P[C++]=E;for(o=0;o<c;o++)b=(g-1)*_,E=x*(t[o].y+k),P[C++]=b,P[C++]=E;i.st=new R.GeometryAttribute({componentDatatype:A.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:new Float32Array(P)})}var V=u-2*c;for(a=0;a<y.length;a+=3){var L=y[a]+V,w=y[a+1]+V,F=y[a+2]+V;h[v++]=L,h[v++]=w,h[v++]=F,h[v++]=F+c,h[v++]=w+c,h[v++]=L+c}var T=new R.Geometry({attributes:i,indices:h,boundingSphere:G.BoundingSphere.fromVertices(e),primitiveType:R.PrimitiveType.TRIANGLES});if(r.normal&&(T=I.GeometryPipeline.computeNormal(T)),r.tangent||r.bitangent){try{T=I.GeometryPipeline.computeTangentAndBitangent(T)}catch(e){B("polyline-volume-tangent-bitangent","Unable to compute tangents and bitangents for polyline volume geometry")}r.tangent||(T.attributes.tangent=void 0),r.bitangent||(T.attributes.bitangent=void 0),r.st||(T.attributes.st=void 0)}return T}(m.PolylineVolumeGeometryLibrary.computePositions(n,r,i,e,!0),r,i,e._vertexFormat)}},function(e,t){return c.defined(t)&&(e=b.unpack(e,t)),e._ellipsoid=u.Ellipsoid.clone(e._ellipsoid),b.createGeometry(e)}});

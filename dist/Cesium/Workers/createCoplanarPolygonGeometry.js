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
define(["./when-a55a8a4c","./Check-bc1d37d9","./Math-73a8bd13","./Cartesian2-8c9f79ed","./Transforms-7a81c8c2","./RuntimeError-7c184ac0","./WebGLConstants-4c11ee5f","./ComponentDatatype-c2c50230","./GeometryAttribute-f9641809","./GeometryAttributes-1c7ce91d","./AttributeCompression-fbcb3321","./GeometryPipeline-24d3be03","./EncodedCartesian3-11d9c783","./IndexDatatype-486e7786","./IntersectionTests-3bb891b7","./Plane-a6a20716","./VertexFormat-e1477d0a","./GeometryInstance-08f0b75f","./arrayRemoveDuplicates-9c727c83","./BoundingRectangle-e13a8907","./EllipsoidTangentPlane-7f2f6dd6","./OrientedBoundingBox-3bad3d73","./CoplanarPolygonGeometryLibrary-362fc2fc","./ArcType-66bc286a","./EllipsoidRhumbLine-cddfa697","./PolygonPipeline-c12287cd","./PolygonGeometryLibrary-d8e15d2e"],function(s,e,V,R,I,t,a,M,H,B,n,w,r,O,o,i,p,A,F,l,c,y,G,m,u,z,L){"use strict";var S=new R.Cartesian3,E=new l.BoundingRectangle,N=new R.Cartesian2,Q=new R.Cartesian2,T=new R.Cartesian3,D=new R.Cartesian3,_=new R.Cartesian3,k=new R.Cartesian3,j=new R.Cartesian3,U=new R.Cartesian3,Y=new I.Quaternion,q=new I.Matrix3,J=new I.Matrix3,W=new R.Cartesian3;function Z(e,t,a,n,r,o,i,l){var s=e.positions,p=z.PolygonPipeline.triangulate(e.positions2D,e.holes);p.length<3&&(p=[0,1,2]);var c=O.IndexDatatype.createTypedArray(s.length,p.length);c.set(p);var y=q;if(0!==n){var m=I.Quaternion.fromAxisAngle(o,n,Y);if(y=I.Matrix3.fromQuaternion(m,y),t.tangent||t.bitangent){m=I.Quaternion.fromAxisAngle(o,-n,Y);var u=I.Matrix3.fromQuaternion(m,J);i=R.Cartesian3.normalize(I.Matrix3.multiplyByVector(u,i,i),i),t.bitangent&&(l=R.Cartesian3.normalize(R.Cartesian3.cross(o,i,l),l))}}else y=I.Matrix3.clone(I.Matrix3.IDENTITY,y);var d=Q;t.st&&(d.x=a.x,d.y=a.y);for(var g=s.length,b=3*g,v=new Float64Array(b),h=t.normal?new Float32Array(b):void 0,f=t.tangent?new Float32Array(b):void 0,C=t.bitangent?new Float32Array(b):void 0,x=t.st?new Float32Array(2*g):void 0,P=0,w=0,A=0,F=0,G=0,L=0;L<g;L++){var E=s[L];if(v[P++]=E.x,v[P++]=E.y,v[P++]=E.z,t.st){var T=r(I.Matrix3.multiplyByVector(y,E,S),N);R.Cartesian2.subtract(T,d,T);var D=V.CesiumMath.clamp(T.x/a.width,0,1),_=V.CesiumMath.clamp(T.y/a.height,0,1);x[G++]=D,x[G++]=_}t.normal&&(h[w++]=o.x,h[w++]=o.y,h[w++]=o.z),t.tangent&&(f[F++]=i.x,f[F++]=i.y,f[F++]=i.z),t.bitangent&&(C[A++]=l.x,C[A++]=l.y,C[A++]=l.z)}var k=new B.GeometryAttributes;return t.position&&(k.position=new H.GeometryAttribute({componentDatatype:M.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:v})),t.normal&&(k.normal=new H.GeometryAttribute({componentDatatype:M.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:h})),t.tangent&&(k.tangent=new H.GeometryAttribute({componentDatatype:M.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:f})),t.bitangent&&(k.bitangent=new H.GeometryAttribute({componentDatatype:M.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:C})),t.st&&(k.st=new H.GeometryAttribute({componentDatatype:M.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:x})),new H.Geometry({attributes:k,indices:c,primitiveType:H.PrimitiveType.TRIANGLES})}function d(e){var t=(e=s.defaultValue(e,s.defaultValue.EMPTY_OBJECT)).polygonHierarchy,a=s.defaultValue(e.vertexFormat,p.VertexFormat.DEFAULT);this._vertexFormat=p.VertexFormat.clone(a),this._polygonHierarchy=t,this._stRotation=s.defaultValue(e.stRotation,0),this._ellipsoid=R.Ellipsoid.clone(s.defaultValue(e.ellipsoid,R.Ellipsoid.WGS84)),this._workerName="createCoplanarPolygonGeometry",this.packedLength=L.PolygonGeometryLibrary.computeHierarchyPackedLength(t)+p.VertexFormat.packedLength+R.Ellipsoid.packedLength+2}d.fromPositions=function(e){return new d({polygonHierarchy:{positions:(e=s.defaultValue(e,s.defaultValue.EMPTY_OBJECT)).positions},vertexFormat:e.vertexFormat,stRotation:e.stRotation,ellipsoid:e.ellipsoid})},d.pack=function(e,t,a){return a=s.defaultValue(a,0),a=L.PolygonGeometryLibrary.packPolygonHierarchy(e._polygonHierarchy,t,a),R.Ellipsoid.pack(e._ellipsoid,t,a),a+=R.Ellipsoid.packedLength,p.VertexFormat.pack(e._vertexFormat,t,a),a+=p.VertexFormat.packedLength,t[a++]=e._stRotation,t[a]=e.packedLength,t};var g=R.Ellipsoid.clone(R.Ellipsoid.UNIT_SPHERE),b=new p.VertexFormat,v={polygonHierarchy:{}};return d.unpack=function(e,t,a){t=s.defaultValue(t,0);var n=L.PolygonGeometryLibrary.unpackPolygonHierarchy(e,t);t=n.startingIndex,delete n.startingIndex;var r=R.Ellipsoid.unpack(e,t,g);t+=R.Ellipsoid.packedLength;var o=p.VertexFormat.unpack(e,t,b);t+=p.VertexFormat.packedLength;var i=e[t++],l=e[t];return s.defined(a)||(a=new d(v)),a._polygonHierarchy=n,a._ellipsoid=R.Ellipsoid.clone(r,a._ellipsoid),a._vertexFormat=p.VertexFormat.clone(o,a._vertexFormat),a._stRotation=i,a.packedLength=l,a},d.createGeometry=function(e){var t=e._vertexFormat,a=e._polygonHierarchy,n=e._stRotation,r=a.positions;if(!((r=F.arrayRemoveDuplicates(r,R.Cartesian3.equalsEpsilon,!0)).length<3)){var o=T,i=D,l=_,s=j,p=U;if(G.CoplanarPolygonGeometryLibrary.computeProjectTo2DArguments(r,k,s,p)){if(o=R.Cartesian3.cross(s,p,o),o=R.Cartesian3.normalize(o,o),!R.Cartesian3.equalsEpsilon(k,R.Cartesian3.ZERO,V.CesiumMath.EPSILON6)){var c=e._ellipsoid.geodeticSurfaceNormal(k,W);R.Cartesian3.dot(o,c)<0&&(o=R.Cartesian3.negate(o,o),s=R.Cartesian3.negate(s,s))}var y=G.CoplanarPolygonGeometryLibrary.createProjectPointsTo2DFunction(k,s,p),m=G.CoplanarPolygonGeometryLibrary.createProjectPointTo2DFunction(k,s,p);t.tangent&&(i=R.Cartesian3.clone(s,i)),t.bitangent&&(l=R.Cartesian3.clone(p,l));var u=L.PolygonGeometryLibrary.polygonsFromHierarchy(a,y,!1),d=u.hierarchy,g=u.polygons;if(0!==d.length){r=d[0].outerRing;for(var b=I.BoundingSphere.fromPoints(r),v=L.PolygonGeometryLibrary.computeBoundingRectangle(o,m,r,n,E),h=[],f=0;f<g.length;f++){var C=new A.GeometryInstance({geometry:Z(g[f],t,v,n,m,o,i,l)});h.push(C)}var x=w.GeometryPipeline.combineInstances(h)[0];x.attributes.position.values=new Float64Array(x.attributes.position.values),x.indices=O.IndexDatatype.createTypedArray(x.attributes.position.values.length/3,x.indices);var P=x.attributes;return t.position||delete P.position,new H.Geometry({attributes:P,indices:x.indices,primitiveType:x.primitiveType,boundingSphere:b})}}}},function(e,t){return s.defined(t)&&(e=d.unpack(e,t)),d.createGeometry(e)}});

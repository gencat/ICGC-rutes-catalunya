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
 * Copyright 2011-2017 Cesium Contributors
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
define(["exports","./defined-2a4f2d00","./Check-e5651467","./defaultValue-29c9b1af","./Math-7782f09e","./Cartesian2-ba70b51f","./Transforms-5119c07b","./ComponentDatatype-418b1c61","./GeometryAttribute-8bc1900e","./GeometryAttributes-f8548d3f","./IndexDatatype-2bcfc06b","./GeometryOffsetAttribute-fa4e7a11","./VertexFormat-e2e35139","./CylinderGeometryLibrary-f35c6b75"],function(t,I,e,m,U,S,B,Y,Z,J,W,j,f,q){"use strict";var H=new S.Cartesian2,K=new S.Cartesian3,Q=new S.Cartesian3,X=new S.Cartesian3,$=new S.Cartesian3;function d(t){var e=(t=m.defaultValue(t,m.defaultValue.EMPTY_OBJECT)).length,a=t.topRadius,r=t.bottomRadius,n=m.defaultValue(t.vertexFormat,f.VertexFormat.DEFAULT),o=m.defaultValue(t.slices,128);this._length=e,this._topRadius=a,this._bottomRadius=r,this._vertexFormat=f.VertexFormat.clone(n),this._slices=o,this._offsetAttribute=t.offsetAttribute,this._workerName="createCylinderGeometry"}d.packedLength=f.VertexFormat.packedLength+5,d.pack=function(t,e,a){return a=m.defaultValue(a,0),f.VertexFormat.pack(t._vertexFormat,e,a),a+=f.VertexFormat.packedLength,e[a++]=t._length,e[a++]=t._topRadius,e[a++]=t._bottomRadius,e[a++]=t._slices,e[a]=m.defaultValue(t._offsetAttribute,-1),e};var a,p=new f.VertexFormat,l={vertexFormat:p,length:void 0,topRadius:void 0,bottomRadius:void 0,slices:void 0,offsetAttribute:void 0};d.unpack=function(t,e,a){e=m.defaultValue(e,0);var r=f.VertexFormat.unpack(t,e,p);e+=f.VertexFormat.packedLength;var n=t[e++],o=t[e++],i=t[e++],s=t[e++],u=t[e];return I.defined(a)?(a._vertexFormat=f.VertexFormat.clone(r,a._vertexFormat),a._length=n,a._topRadius=o,a._bottomRadius=i,a._slices=s,a._offsetAttribute=-1===u?void 0:u,a):(l.length=n,l.topRadius=o,l.bottomRadius=i,l.slices=s,l.offsetAttribute=-1===u?void 0:u,new d(l))},d.createGeometry=function(t){var e=t._length,a=t._topRadius,r=t._bottomRadius,n=t._vertexFormat,o=t._slices;if(!(e<=0||a<0||r<0||0===a&&0===r)){var i,s=o+o,u=o+s,m=s+s,f=q.CylinderGeometryLibrary.computePositions(e,a,r,o,!0),d=n.st?new Float32Array(2*m):void 0,p=n.normal?new Float32Array(3*m):void 0,l=n.tangent?new Float32Array(3*m):void 0,y=n.bitangent?new Float32Array(3*m):void 0,b=n.normal||n.tangent||n.bitangent;if(b){var c=n.tangent||n.bitangent,v=0,A=0,g=0,x=Math.atan2(r-a,e),_=K;_.z=Math.sin(x);var h=Math.cos(x),C=X,F=Q;for(i=0;i<o;i++){var w=i/o*U.CesiumMath.TWO_PI,G=h*Math.cos(w),V=h*Math.sin(w);b&&(_.x=G,_.y=V,c&&(C=S.Cartesian3.normalize(S.Cartesian3.cross(S.Cartesian3.UNIT_Z,_,C),C)),n.normal&&(p[v++]=_.x,p[v++]=_.y,p[v++]=_.z,p[v++]=_.x,p[v++]=_.y,p[v++]=_.z),n.tangent&&(l[A++]=C.x,l[A++]=C.y,l[A++]=C.z,l[A++]=C.x,l[A++]=C.y,l[A++]=C.z),n.bitangent&&(F=S.Cartesian3.normalize(S.Cartesian3.cross(_,C,F),F),y[g++]=F.x,y[g++]=F.y,y[g++]=F.z,y[g++]=F.x,y[g++]=F.y,y[g++]=F.z))}for(i=0;i<o;i++)n.normal&&(p[v++]=0,p[v++]=0,p[v++]=-1),n.tangent&&(l[A++]=1,l[A++]=0,l[A++]=0),n.bitangent&&(y[g++]=0,y[g++]=-1,y[g++]=0);for(i=0;i<o;i++)n.normal&&(p[v++]=0,p[v++]=0,p[v++]=1),n.tangent&&(l[A++]=1,l[A++]=0,l[A++]=0),n.bitangent&&(y[g++]=0,y[g++]=1,y[g++]=0)}var D=12*o-12,R=W.IndexDatatype.createTypedArray(m,D),T=0,O=0;for(i=0;i<o-1;i++)R[T++]=O,R[T++]=O+2,R[T++]=O+3,R[T++]=O,R[T++]=O+3,R[T++]=O+1,O+=2;for(R[T++]=s-2,R[T++]=0,R[T++]=1,R[T++]=s-2,R[T++]=1,R[T++]=s-1,i=1;i<o-1;i++)R[T++]=s+i+1,R[T++]=s+i,R[T++]=s;for(i=1;i<o-1;i++)R[T++]=u,R[T++]=u+i,R[T++]=u+i+1;var L=0;if(n.st){var P=Math.max(a,r);for(i=0;i<m;i++){var k=S.Cartesian3.fromArray(f,3*i,$);d[L++]=(k.x+P)/(2*P),d[L++]=(k.y+P)/(2*P)}}var M=new J.GeometryAttributes;n.position&&(M.position=new Z.GeometryAttribute({componentDatatype:Y.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:f})),n.normal&&(M.normal=new Z.GeometryAttribute({componentDatatype:Y.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:p})),n.tangent&&(M.tangent=new Z.GeometryAttribute({componentDatatype:Y.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:l})),n.bitangent&&(M.bitangent=new Z.GeometryAttribute({componentDatatype:Y.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:y})),n.st&&(M.st=new Z.GeometryAttribute({componentDatatype:Y.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:d})),H.x=.5*e,H.y=Math.max(r,a);var z=new B.BoundingSphere(S.Cartesian3.ZERO,S.Cartesian2.magnitude(H));if(I.defined(t._offsetAttribute)){e=f.length;var E=new Uint8Array(e/3),N=t._offsetAttribute===j.GeometryOffsetAttribute.NONE?0:1;j.arrayFill(E,N),M.applyOffset=new Z.GeometryAttribute({componentDatatype:Y.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:E})}return new Z.Geometry({attributes:M,indices:R,primitiveType:Z.PrimitiveType.TRIANGLES,boundingSphere:z,offsetAttribute:t._offsetAttribute})}},d.getUnitCylinder=function(){return I.defined(a)||(a=d.createGeometry(new d({topRadius:1,bottomRadius:1,length:1,vertexFormat:f.VertexFormat.POSITION_ONLY}))),a},t.CylinderGeometry=d});

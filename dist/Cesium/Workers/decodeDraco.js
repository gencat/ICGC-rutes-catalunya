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
define(["./when-a55a8a4c","./Check-bc1d37d9","./Math-73a8bd13","./RuntimeError-7c184ac0","./WebGLConstants-4c11ee5f","./ComponentDatatype-c2c50230","./IndexDatatype-486e7786","./createTaskProcessorWorker"],function(f,e,r,m,t,A,b,n){"use strict";var w;function l(e,r,t){var n,a=e.num_points(),o=t.num_components(),i=new w.AttributeQuantizationTransform;if(i.InitFromAttribute(t)){for(var u=new Array(o),s=0;s<o;++s)u[s]=i.min_value(s);n={quantizationBits:i.quantization_bits(),minValues:u,range:i.range(),octEncoded:!1}}w.destroy(i),(i=new w.AttributeOctahedronTransform).InitFromAttribute(t)&&(n={quantizationBits:i.quantization_bits(),octEncoded:!0}),w.destroy(i);var c,d=a*o;c=f.defined(n)?function(e,r,t,n,a){var o,i;n.quantizationBits<=8?(i=new w.DracoUInt8Array,o=new Uint8Array(a),r.GetAttributeUInt8ForAllPoints(e,t,i)):(i=new w.DracoUInt16Array,o=new Uint16Array(a),r.GetAttributeUInt16ForAllPoints(e,t,i));for(var u=0;u<a;++u)o[u]=i.GetValue(u);return w.destroy(i),o}(e,r,t,n,d):function(e,r,t,n){var a,o;switch(t.data_type()){case 1:case 11:o=new w.DracoInt8Array,a=new Int8Array(n),r.GetAttributeInt8ForAllPoints(e,t,o);break;case 2:o=new w.DracoUInt8Array,a=new Uint8Array(n),r.GetAttributeUInt8ForAllPoints(e,t,o);break;case 3:o=new w.DracoInt16Array,a=new Int16Array(n),r.GetAttributeInt16ForAllPoints(e,t,o);break;case 4:o=new w.DracoUInt16Array,a=new Uint16Array(n),r.GetAttributeUInt16ForAllPoints(e,t,o);break;case 5:case 7:o=new w.DracoInt32Array,a=new Int32Array(n),r.GetAttributeInt32ForAllPoints(e,t,o);break;case 6:case 8:o=new w.DracoUInt32Array,a=new Uint32Array(n),r.GetAttributeUInt32ForAllPoints(e,t,o);break;case 9:case 10:o=new w.DracoFloat32Array,a=new Float32Array(n),r.GetAttributeFloatForAllPoints(e,t,o)}for(var i=0;i<n;++i)a[i]=o.GetValue(i);return w.destroy(o),a}(e,r,t,d);var y=A.ComponentDatatype.fromTypedArray(c);return{array:c,data:{componentsPerAttribute:o,componentDatatype:y,byteOffset:t.byte_offset(),byteStride:A.ComponentDatatype.getSizeInBytes(y)*o,normalized:t.normalized(),quantization:n}}}function a(e){var r=new w.Decoder,t=["POSITION","NORMAL","COLOR","TEX_COORD"];if(e.dequantizeInShader)for(var n=0;n<t.length;++n)r.SkipAttributeTransform(w[t[n]]);var a=e.bufferView,o=new w.DecoderBuffer;if(o.Init(e.array,a.byteLength),r.GetEncodedGeometryType(o)!==w.TRIANGULAR_MESH)throw new m.RuntimeError("Unsupported draco mesh geometry type.");var i=new w.Mesh,u=r.DecodeBufferToMesh(o,i);if(!u.ok()||0===i.ptr)throw new m.RuntimeError("Error decoding draco mesh geometry: "+u.error_msg());w.destroy(o);var s={},c=e.compressedAttributes;for(var d in c)if(c.hasOwnProperty(d)){var y=c[d],f=r.GetAttributeByUniqueId(i,y);s[d]=l(i,r,f)}var A={indexArray:function(e,r){for(var t=e.num_points(),n=e.num_faces(),a=new w.DracoInt32Array,o=3*n,i=b.IndexDatatype.createTypedArray(t,o),u=0,s=0;s<n;++s)r.GetFaceFromMesh(e,s,a),i[u+0]=a.GetValue(0),i[u+1]=a.GetValue(1),i[u+2]=a.GetValue(2),u+=3;return w.destroy(a),{typedArray:i,numberOfIndices:o}}(i,r),attributeData:s};return w.destroy(i),w.destroy(r),A}function o(e){return(f.defined(e.primitive)?a:function(e){var r=new w.Decoder;e.dequantizeInShader&&(r.SkipAttributeTransform(w.POSITION),r.SkipAttributeTransform(w.NORMAL));var t=new w.DecoderBuffer;if(t.Init(e.buffer,e.buffer.length),r.GetEncodedGeometryType(t)!==w.POINT_CLOUD)throw new m.RuntimeError("Draco geometry type must be POINT_CLOUD.");var n=new w.PointCloud,a=r.DecodeBufferToPointCloud(t,n);if(!a.ok()||0===n.ptr)throw new m.RuntimeError("Error decoding draco point cloud: "+a.error_msg());w.destroy(t);var o={},i=e.properties;for(var u in i)if(i.hasOwnProperty(u)){var s=i[u],c=r.GetAttributeByUniqueId(n,s);o[u]=l(n,r,c)}return w.destroy(n),w.destroy(r),o})(e)}function i(e){w=e,self.onmessage=n(o),self.postMessage(!0)}return function(e){var r=e.data.webAssemblyConfig;if(f.defined(r))return require([r.modulePath],function(e){f.defined(r.wasmBinaryFile)?(f.defined(e)||(e=self.DracoDecoderModule),e(r).then(function(e){i(e)})):i(e())})}});

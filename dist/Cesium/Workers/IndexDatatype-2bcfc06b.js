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
define(["exports","./defined-2a4f2d00","./Check-e5651467","./freezeObject-a51e076f","./Math-7782f09e","./WebGLConstants-90dbfe2f"],function(e,r,t,n,N,E){"use strict";var a={UNSIGNED_BYTE:E.WebGLConstants.UNSIGNED_BYTE,UNSIGNED_SHORT:E.WebGLConstants.UNSIGNED_SHORT,UNSIGNED_INT:E.WebGLConstants.UNSIGNED_INT,getSizeInBytes:function(e){switch(e){case a.UNSIGNED_BYTE:return Uint8Array.BYTES_PER_ELEMENT;case a.UNSIGNED_SHORT:return Uint16Array.BYTES_PER_ELEMENT;case a.UNSIGNED_INT:return Uint32Array.BYTES_PER_ELEMENT}},fromSizeInBytes:function(e){switch(e){case 2:return a.UNSIGNED_SHORT;case 4:return a.UNSIGNED_INT;case 1:return a.UNSIGNED_BYTE}},validate:function(e){return r.defined(e)&&(e===a.UNSIGNED_BYTE||e===a.UNSIGNED_SHORT||e===a.UNSIGNED_INT)},createTypedArray:function(e,r){return e>=N.CesiumMath.SIXTY_FOUR_KILOBYTES?new Uint32Array(r):new Uint16Array(r)},createTypedArrayFromArrayBuffer:function(e,r,t,n){return e>=N.CesiumMath.SIXTY_FOUR_KILOBYTES?new Uint32Array(r,t,n):new Uint16Array(r,t,n)}},S=n.freezeObject(a);e.IndexDatatype=S});

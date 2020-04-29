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
define(["./when-a55a8a4c"],function(i){"use strict";return function(a){var s;return function(e){var r=e.data,n=[],t={id:r.id,result:void 0,error:void 0};return i.when(function(e,r,n){try{return e(r,n)}catch(e){return i.when.reject(e)}}(a,r.parameters,n)).then(function(e){t.result=e}).otherwise(function(e){e instanceof Error?t.error={name:e.name,message:e.message,stack:e.stack}:t.error=e}).always(function(){i.defined(s)||(s=i.defaultValue(self.webkitPostMessage,self.postMessage)),r.canTransferArrayBuffer||(n.length=0);try{s(t,n)}catch(e){t.result=void 0,t.error="postMessage failed with error: "+function(e){var r,n=e.name,t=e.message;r=i.defined(n)&&i.defined(t)?n+": "+t:e.toString();var a=e.stack;return i.defined(a)&&(r+="\n"+a),r}(e)+"\n  with responseMessage: "+JSON.stringify(t),s(t)}})}}});

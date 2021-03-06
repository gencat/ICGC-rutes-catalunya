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
define(["exports","./when-a55a8a4c","./Check-bc1d37d9","./Math-73a8bd13","./Cartesian2-8c9f79ed"],function(t,b,a,T,R){"use strict";function z(t,a,i,n,e,s,r){var h,o,d=(h=t)*(o=i)*(4+h*(4-3*o))/16;return(1-d)*t*a*(n+d*e*(r+d*s*(2*r*r-1)))}var y=new R.Cartesian3,E=new R.Cartesian3;function e(t,a,i,n){var e,s,r,h,o,d,c,u,M,l,g,_,p,f,v,m,C,H,O,S,q,U,b,w,A;R.Cartesian3.normalize(n.cartographicToCartesian(a,E),y),R.Cartesian3.normalize(n.cartographicToCartesian(i,E),E);!function(t,a,i,n,e,s,r){var h,o,d,c,u,M=(a-i)/a,l=s-n,g=Math.atan((1-M)*Math.tan(e)),_=Math.atan((1-M)*Math.tan(r)),p=Math.cos(g),f=Math.sin(g),v=Math.cos(_),m=Math.sin(_),C=p*v,H=p*m,O=f*m,S=f*v,q=l,U=T.CesiumMath.TWO_PI,b=Math.cos(q),w=Math.sin(q);do{b=Math.cos(q),w=Math.sin(q);var A,R=H-S*b;d=Math.sqrt(v*v*w*w+R*R),o=O+C*b,h=Math.atan2(d,o),U=q,u=o-2*O/(c=0===d?(A=0,1):1-(A=C*w/d)*A),isNaN(u)&&(u=0),q=l+z(M,A,c,h,d,o,u)}while(Math.abs(q-U)>T.CesiumMath.EPSILON12);var y=c*(a*a-i*i)/(i*i),E=y*(256+y*(y*(74-47*y)-128))/1024,P=u*u,x=i*(1+y*(4096+y*(y*(320-175*y)-768))/16384)*(h-E*d*(u+E*(o*(2*P-1)-E*u*(4*d*d-3)*(4*P-3)/6)/4)),D=Math.atan2(v*w,H-S*b),N=Math.atan2(p*w,H*b-S);t._distance=x,t._startHeading=D,t._endHeading=N,t._uSquared=y}(t,n.maximumRadius,n.minimumRadius,a.longitude,a.latitude,i.longitude,i.latitude),t._start=R.Cartographic.clone(a,t._start),t._end=R.Cartographic.clone(i,t._end),t._start.height=0,t._end.height=0,s=(e=t)._uSquared,r=e._ellipsoid.maximumRadius,h=e._ellipsoid.minimumRadius,o=(r-h)/r,d=Math.cos(e._startHeading),c=Math.sin(e._startHeading),u=(1-o)*Math.tan(e._start.latitude),M=1/Math.sqrt(1+u*u),l=M*u,g=Math.atan2(u,d),f=1-(p=(_=M*c)*_),v=Math.sqrt(f),U=1-3*(m=s/4)+35*(C=m*m)/4,b=1-5*m,w=(S=1+m-3*C/4+5*(H=C*m)/4-175*(O=C*C)/64)*g-(q=1-m+15*C/8-35*H/8)*Math.sin(2*g)*m/2-U*Math.sin(4*g)*C/16-b*Math.sin(6*g)*H/48-5*Math.sin(8*g)*O/512,(A=e._constants).a=r,A.b=h,A.f=o,A.cosineHeading=d,A.sineHeading=c,A.tanU=u,A.cosineU=M,A.sineU=l,A.sigma=g,A.sineAlpha=_,A.sineSquaredAlpha=p,A.cosineSquaredAlpha=f,A.cosineAlpha=v,A.u2Over4=m,A.u4Over16=C,A.u6Over64=H,A.u8Over256=O,A.a0=S,A.a1=q,A.a2=U,A.a3=b,A.distanceRatio=w}function i(t,a,i){var n=b.defaultValue(i,R.Ellipsoid.WGS84);this._ellipsoid=n,this._start=new R.Cartographic,this._end=new R.Cartographic,this._constants={},this._startHeading=void 0,this._endHeading=void 0,this._distance=void 0,this._uSquared=void 0,b.defined(t)&&b.defined(a)&&e(this,t,a,n)}Object.defineProperties(i.prototype,{ellipsoid:{get:function(){return this._ellipsoid}},surfaceDistance:{get:function(){return this._distance}},start:{get:function(){return this._start}},end:{get:function(){return this._end}},startHeading:{get:function(){return this._startHeading}},endHeading:{get:function(){return this._endHeading}}}),i.prototype.setEndPoints=function(t,a){e(this,t,a,this._ellipsoid)},i.prototype.interpolateUsingFraction=function(t,a){return this.interpolateUsingSurfaceDistance(this._distance*t,a)},i.prototype.interpolateUsingSurfaceDistance=function(t,a){var i=this._constants,n=i.distanceRatio+t/i.b,e=Math.cos(2*n),s=Math.cos(4*n),r=Math.cos(6*n),h=Math.sin(2*n),o=Math.sin(4*n),d=Math.sin(6*n),c=Math.sin(8*n),u=n*n,M=n*u,l=i.u8Over256,g=i.u2Over4,_=i.u6Over64,p=i.u4Over16,f=2*M*l*e/3+n*(1-g+7*p/4-15*_/4+579*l/64-(p-15*_/4+187*l/16)*e-(5*_/4-115*l/16)*s-29*l*r/16)+(g/2-p+71*_/32-85*l/16)*h+(5*p/16-5*_/4+383*l/96)*o-u*((_-11*l/2)*h+5*l*o/2)+(29*_/96-29*l/16)*d+539*l*c/1536,v=Math.asin(Math.sin(f)*i.cosineAlpha),m=Math.atan(i.a/i.b*Math.tan(v));f-=i.sigma;var C=Math.cos(2*i.sigma+f),H=Math.sin(f),O=Math.cos(f),S=i.cosineU*O,q=i.sineU*H,U=Math.atan2(H*i.sineHeading,S-q*i.cosineHeading)-z(i.f,i.sineAlpha,i.cosineSquaredAlpha,f,H,O,C);return b.defined(a)?(a.longitude=this._start.longitude+U,a.latitude=m,a.height=0,a):new R.Cartographic(this._start.longitude+U,m,0)},t.EllipsoidGeodesic=i});

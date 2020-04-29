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
define(["exports","./defined-2a4f2d00","./Check-e5651467","./defaultValue-29c9b1af","./Math-7782f09e","./Cartesian2-ba70b51f","./defineProperties-c817531e"],function(t,b,a,e,T,R,i){"use strict";function z(t,a,i,n,e,s,r){var h,o,d=(h=t)*(o=i)*(4+h*(4-3*o))/16;return(1-d)*t*a*(n+d*e*(r+d*s*(2*r*r-1)))}var P=new R.Cartesian3,y=new R.Cartesian3;function s(t,a,i,n){var e,s,r,h,o,d,u,c,M,l,g,_,p,f,v,m,C,H,O,S,q,U,b,A,w;R.Cartesian3.normalize(n.cartographicToCartesian(a,y),P),R.Cartesian3.normalize(n.cartographicToCartesian(i,y),y);!function(t,a,i,n,e,s,r){var h,o,d,u,c,M=(a-i)/a,l=s-n,g=Math.atan((1-M)*Math.tan(e)),_=Math.atan((1-M)*Math.tan(r)),p=Math.cos(g),f=Math.sin(g),v=Math.cos(_),m=Math.sin(_),C=p*v,H=p*m,O=f*m,S=f*v,q=l,U=T.CesiumMath.TWO_PI,b=Math.cos(q),A=Math.sin(q);do{b=Math.cos(q),A=Math.sin(q);var w,R=H-S*b;d=Math.sqrt(v*v*A*A+R*R),o=O+C*b,h=Math.atan2(d,o),U=q,c=o-2*O/(u=0===d?(w=0,1):1-(w=C*A/d)*w),isNaN(c)&&(c=0),q=l+z(M,w,u,h,d,o,c)}while(Math.abs(q-U)>T.CesiumMath.EPSILON12);var P=u*(a*a-i*i)/(i*i),y=P*(256+P*(P*(74-47*P)-128))/1024,E=c*c,x=i*(1+P*(4096+P*(P*(320-175*P)-768))/16384)*(h-y*d*(c+y*(o*(2*E-1)-y*c*(4*d*d-3)*(4*E-3)/6)/4)),D=Math.atan2(v*A,H-S*b),N=Math.atan2(p*A,H*b-S);t._distance=x,t._startHeading=D,t._endHeading=N,t._uSquared=P}(t,n.maximumRadius,n.minimumRadius,a.longitude,a.latitude,i.longitude,i.latitude),t._start=R.Cartographic.clone(a,t._start),t._end=R.Cartographic.clone(i,t._end),t._start.height=0,t._end.height=0,s=(e=t)._uSquared,r=e._ellipsoid.maximumRadius,h=e._ellipsoid.minimumRadius,o=(r-h)/r,d=Math.cos(e._startHeading),u=Math.sin(e._startHeading),c=(1-o)*Math.tan(e._start.latitude),M=1/Math.sqrt(1+c*c),l=M*c,g=Math.atan2(c,d),f=1-(p=(_=M*u)*_),v=Math.sqrt(f),U=1-3*(m=s/4)+35*(C=m*m)/4,b=1-5*m,A=(S=1+m-3*C/4+5*(H=C*m)/4-175*(O=C*C)/64)*g-(q=1-m+15*C/8-35*H/8)*Math.sin(2*g)*m/2-U*Math.sin(4*g)*C/16-b*Math.sin(6*g)*H/48-5*Math.sin(8*g)*O/512,(w=e._constants).a=r,w.b=h,w.f=o,w.cosineHeading=d,w.sineHeading=u,w.tanU=c,w.cosineU=M,w.sineU=l,w.sigma=g,w.sineAlpha=_,w.sineSquaredAlpha=p,w.cosineSquaredAlpha=f,w.cosineAlpha=v,w.u2Over4=m,w.u4Over16=C,w.u6Over64=H,w.u8Over256=O,w.a0=S,w.a1=q,w.a2=U,w.a3=b,w.distanceRatio=A}function n(t,a,i){var n=e.defaultValue(i,R.Ellipsoid.WGS84);this._ellipsoid=n,this._start=new R.Cartographic,this._end=new R.Cartographic,this._constants={},this._startHeading=void 0,this._endHeading=void 0,this._distance=void 0,this._uSquared=void 0,b.defined(t)&&b.defined(a)&&s(this,t,a,n)}i.defineProperties(n.prototype,{ellipsoid:{get:function(){return this._ellipsoid}},surfaceDistance:{get:function(){return this._distance}},start:{get:function(){return this._start}},end:{get:function(){return this._end}},startHeading:{get:function(){return this._startHeading}},endHeading:{get:function(){return this._endHeading}}}),n.prototype.setEndPoints=function(t,a){s(this,t,a,this._ellipsoid)},n.prototype.interpolateUsingFraction=function(t,a){return this.interpolateUsingSurfaceDistance(this._distance*t,a)},n.prototype.interpolateUsingSurfaceDistance=function(t,a){var i=this._constants,n=i.distanceRatio+t/i.b,e=Math.cos(2*n),s=Math.cos(4*n),r=Math.cos(6*n),h=Math.sin(2*n),o=Math.sin(4*n),d=Math.sin(6*n),u=Math.sin(8*n),c=n*n,M=n*c,l=i.u8Over256,g=i.u2Over4,_=i.u6Over64,p=i.u4Over16,f=2*M*l*e/3+n*(1-g+7*p/4-15*_/4+579*l/64-(p-15*_/4+187*l/16)*e-(5*_/4-115*l/16)*s-29*l*r/16)+(g/2-p+71*_/32-85*l/16)*h+(5*p/16-5*_/4+383*l/96)*o-c*((_-11*l/2)*h+5*l*o/2)+(29*_/96-29*l/16)*d+539*l*u/1536,v=Math.asin(Math.sin(f)*i.cosineAlpha),m=Math.atan(i.a/i.b*Math.tan(v));f-=i.sigma;var C=Math.cos(2*i.sigma+f),H=Math.sin(f),O=Math.cos(f),S=i.cosineU*O,q=i.sineU*H,U=Math.atan2(H*i.sineHeading,S-q*i.cosineHeading)-z(i.f,i.sineAlpha,i.cosineSquaredAlpha,f,H,O,C);return b.defined(a)?(a.longitude=this._start.longitude+U,a.latitude=m,a.height=0,a):new R.Cartographic(this._start.longitude+U,m,0)},t.EllipsoidGeodesic=n});

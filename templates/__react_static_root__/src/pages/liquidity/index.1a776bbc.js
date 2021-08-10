(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{648:function(e,n,t){"use strict";t.r(n);var c=t(6),r=t.n(c),i=t(129),a=t(71),u=t(21),o=t(43),s=t(56),l=t(1605),f=t(131),d=t(13),b=function(e){return e.ui.liquidity.form.assetId},g=function(e){return e.ui.liquidity.form.signingAccount},O=function(e){return e.ui.liquidity.exchangePool},j=function(e){return e.ui.liquidity.txFee},h=function(e){return e.ui.liquidity.form.feeAssetId},A=function(e){return e.global.coreAssetId},m=function(e){return e.ui.liquidity.userAssetBalance},y=function(e){return e.global.assetInfo},I=Object(f.a)([y],function(e){var n=[];return e&&e.forEach(function(e){var t={symbol:e.symbol,id:e.id};n.push(t)}),n}),p=Object(f.a)([b,function(e){return e.ui.liquidity.userPoolShare},g],function(e,n,t){return e&&n.length?n.find(function(n){return n.assetId===e&&n.address===t}):null}),v=(Object(f.a)([b,function(e){return e.ui.liquidity.form.assetAmount},A],function(e,n,t){}),Object(f.a)([b,m,g],function(e,n,t){if(!e)return null;if(!n.length)return null;var c=n.find(function(n){return n.assetId===e&&n.account===t});return c?c.balance:null})),P=Object(f.a)([A,m,g],function(e,n,t){if(!e)return null;var c=+e.toString();if(!n.length)return null;var r=n.find(function(e){return e.assetId===c&&e.account===t});return r?r.balance:null}),S=Object(f.a)([b,O,A],function(e,n,t){if(!e)return null;if(!n.length)return null;var c=n.find(function(n){return n.assetId===e});return c?c.assetBalance:e.toString()===t.toString()?n[0].coreAssetBalance:void 0}),q=Object(f.a)([b,O],function(e,n){if(!e)return null;if(!n.length)return null;var t=n.find(function(n){return n.assetId===e});return t?t.coreAssetBalance:void 0}),w=function(e,n){return e&&e.find(function(e){return e.id===n})||null},C=Object(f.a)([function(e){return e.ui.liquidity.exchangeRate},I,A,b,function(e){return e.ui.liquidity.form.coreAmount},y],function(e,n,t,c,r,i){if(r&&e){var a=e.asString(i[c].decimalPlaces);return e?"Exchange rate: 1 ".concat(w(n,t).symbol," = ").concat(a," ").concat(w(n,c).symbol,"."):""}}),D=Object(f.a)([j,A,h,y],function(e,n,t,c){var r,i=c.length>0&&c[t]?c[t].symbol:"CPAY";return n&&n===t&&e?r="".concat(e.feeInCpay.asString(c[t].decimalPlaces)," ").concat(i):e&&e.feeInFeeAsset&&(r="".concat(e.feeInFeeAsset.asString(c[n].decimalPlaces)," ").concat(i,")")),r}),x=Object(f.a)([j,I,h,A,y],function(e,n,t,c,r){var i;return String(t)===String(c)&&e?(i=e.feeInCpay.asString(r[c].decimalPlaces,d.a.ROUND_UP),"Transaction fee is ".concat(i," ").concat(w(n,t).symbol)):e&&e.feeInFeeAsset?(i=e.feeInFeeAsset.asString(r[t].decimalPlaces,d.a.ROUND_UP),"Transaction fee is ".concat(i," ").concat(w(n,t).symbol," (converted to ").concat(e.feeInCpay.asString(r[c].decimalPlaces,d.a.ROUND_UP)," CPAY)")):void 0});function R(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);n&&(c=c.filter(function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable})),t.push.apply(t,c)}return t}function F(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?R(Object(t),!0).forEach(function(n){r()(e,n,t[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):R(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})}return e}n.default=Object(i.c)(function(e){return F(F({},e.ui.liquidity),{},{coreAssetId:e.global.coreAssetId,feeRate:e.global.feeRate,assetInfo:e.global.assetInfo,assets:I(e),assetReserve:S(e),accountAssetBalance:v(e),accountCoreBalance:P(e),coreReserve:q(e),accounts:e.extension.accounts.map(function(e){return{label:"".concat(e.name),value:e.address}}),fee:D(e),exchangeRateMsg:C(e),txFeeMsg:x(e),userShareInPool:p(e)})},function(e){return{handleAssetAmountChange:function(n){e(Object(u.k)(n)),e(Object(u.h)())},handleCoreAmountChange:function(n){e(Object(u.l)(n)),e(Object(u.h)())},handleSelectedAccountChange:function(n){e(Object(u.v)(n))},handleLiquidityAction:function(n){e(Object(u.m)(n)),e(Object(u.r)(n===l.d.ADD?s.a:s.b))},handleFeeBufferChange:function(n){e(Object(u.z)(n))},handleAssetIdChange:function(n,t,c){t.assetId,t.coreAmount;var r=function(e,n){var t=null;return e.forEach(function(e){e instanceof a.b&&(e.asset.id===n&&(t=e))}),t}(c,n);r&&e(Object(u.c)(r)),e(Object(u.w)(n))},handleExtrinsicChange:function(n){n===l.d.ADD?e(Object(u.r)(s.a)):e(Object(u.r)(s.b))},handleReset:function(){e(Object(u.j)())},openTxDialog:function(n,t){var c=n.extrinsic,r=n.signingAccount,i=n.feeAssetId,a=n.assetAmount,u=n.coreAmount,l=n.assetId,f=n.coreAssetId,d=(n.buffer,n.type,Object(s.e)(c,{assetId:l,coreAssetId:f,coreAmount:u,assetAmount:a})),b={method:c||s.a,params:d,price:c===s.a?a:u};e(Object(o.d)({title:"liquidity",signingAccount:r,extrinsic:b,feeInFeeAsset:t,feeAssetId:i}))}}})(l.c)}}]);
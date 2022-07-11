(this.webpackJsonptezori3=this.webpackJsonptezori3||[]).push([[0],{136:function(e,t,n){},153:function(e,t){},237:function(e,t){},239:function(e,t){},249:function(e,t){},251:function(e,t){},280:function(e,t){},282:function(e,t){},283:function(e,t){},288:function(e,t){},290:function(e,t){},309:function(e,t){},321:function(e,t){},324:function(e,t){},424:function(e,t,n){"use strict";n.r(t);var r,a=n(15),i=n.n(a),c=n(216),o=n.n(c),s=(n(136),n(40)),u=n(16),f=n(0),l=n.n(f),d=n(63);!function(e){e[e.UpdateAddress=0]="UpdateAddress"}(r||(r={}));var p=function(e,t){return t.type===r.UpdateAddress?Object(d.a)(Object(d.a)({},e),{},{address:t.newAddress}):e},b=n(225),j=n(12),h={address:"tz1Z2Ne4ZHxNPuCJeCcoykHVXTqhVdLMD9gV",derivationPath:"44'/1729'/0'/0'/1'",network:"mainnet",tezosServer:"https://tezos-prod.cryptonomic-infra.tech:443",apiKey:"ab682065-864a-4f11-bc77-0ef4e9493fa1",beaconClient:new b.a({name:"Tezori"}),children:null},O=Object(a.createContext)({globalState:h,dispatch:function(){return null}}),g=function(e){var t=e.children,n=Object(a.useReducer)(p,h),r=Object(u.a)(n,2),i=r[0],c=r[1];return Object(j.jsx)(O.Provider,{value:{globalState:i,dispatch:c},children:t})},m=n(219),v=n(222);function x(){var e=Object(a.useContext)(O),t=e.globalState,n=e.dispatch,i=Object(a.useState)(t.address),c=Object(u.a)(i,2),o=c[0],f=c[1],d=Object(a.useState)(!1),p=Object(u.a)(d,2),b=p[0],h=p[1],g=Object(a.useState)(),x=Object(u.a)(g,2),y=x[0],k=x[1],S=function(){var e=Object(s.a)(l.a.mark((function e(){var t,n,r;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(b){e.next=9;break}return e.next=3,m.a.create();case 3:t=e.sent,console.log("transport",t),n=new v.a(t),console.log("appXtz",n),k(n),h(!0);case 9:if(!y){e.next=15;break}return e.next=12,y.getAddress("44'/1729'/0'/0'");case 12:r=e.sent,console.log("address",r),f(r.address);case 15:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),w=function(){var e=Object(s.a)(l.a.mark((function e(){var n,r,a;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(n=t.beaconClient)){e.next=17;break}return e.next=4,n.getActiveAccount();case 4:if(!(r=e.sent)){e.next=9;break}f(r.address),e.next=15;break;case 9:return console.log("Requesting permissions..."),e.next=12,n.requestPermissions();case 12:a=e.sent,console.log("Got permissions:",a),f(a.address);case 15:e.next=18;break;case 17:throw ReferenceError("Beacon client not defined!");case 18:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(j.jsxs)("div",{children:[Object(j.jsx)("input",{id:"address",value:o,onChange:function(e){f(e.currentTarget.value)}}),Object(j.jsx)("button",{onClick:function(){return function(){var e={type:r.UpdateAddress,newAddress:o};n(e)}()},children:"Update"}),Object(j.jsx)("button",{onClick:function(){return S()},children:"Get from Ledger"}),Object(j.jsx)("button",{onClick:function(){return w()},children:"Get from Beacon"})]})}function y(){var e=Object(a.useContext)(O).globalState;return Object(j.jsxs)("div",{id:"settings",children:[Object(j.jsx)("h1",{children:"Settings"}),Object(j.jsx)("p",{children:"Tezos Node"}),Object(j.jsx)("input",{id:"settings_tezosNode",defaultValue:e.tezosServer}),Object(j.jsx)("p",{children:"Nautilus API Key"}),Object(j.jsx)("input",{id:"settings_apikey",defaultValue:e.apiKey}),Object(j.jsx)("p",{children:"Network"}),Object(j.jsx)("input",{id:"settings_apikey",defaultValue:e.network})]})}var k=n(224),S={publicKey:"",balance:"",delegate:"",balance_usdtz:""};function w(){var e=Object(a.useContext)(O).globalState,t=Object(a.useState)(S),n=Object(u.a)(t,2),r=n[0],i=n[1];return Object(a.useEffect)((function(){var t=function(){var t=Object(s.a)(l.a.mark((function t(){var n;return l.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,k.TezosNodeReader.getAccountForBlock(e.tezosServer,"head",e.address);case 2:n=t.sent,i((function(e){return Object(d.a)(Object(d.a)({},e),{},{balance:n.balance,delegate:n.delegate})}));case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();t().then((function(e){return e}))}),[e]),Object(j.jsxs)("div",{children:[Object(j.jsx)("h1",{children:"Wallet"}),Object(j.jsxs)("p",{children:["Delegate: ",r.delegate]}),Object(j.jsxs)("p",{children:["XTZ Balance: ",r.balance]})]})}var _=n(3),C=n(2),N=n(8),T=n(9),z=n(227),J=n(134),A=n(19),R=n.n(A),L={url:"https://imgproxy-prod.cryptonomic-infra.tech",version:"1.0.0",apikey:"TQf4O3OwUYaNYyXjVHLGXQoPZXa0FtsNSijyxxwSYhc7hbeJdtR2kLBK0uTBDsxJ"},E=function(e){Object(N.a)(n,e);var t=Object(T.a)(n);function n(e){var r;return Object(C.a)(this,n),(r=t.call(this,e)).name="CacheMissError",r}return Object(_.a)(n)}(Object(z.a)(Error)),F=function(e){return"CONTENT_PROXY_CACHE_"+e},P=function(){var e=Object(s.a)(l.a.mark((function e(t){var n,r;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=M(t),R.a.info("Lookup result: "+JSON.stringify(n)),!(n instanceof E)){e.next=16;break}return R.a.info("Fetching from content proxy: "+t),e.next=6,Object(J.proxyFetch)(L,t,J.ImageProxyDataType.Json,!1);case 6:if("string"===typeof(r=e.sent)||"Ok"!==r.rpc_status.toString()){e.next=12;break}return U(t,r),e.abrupt("return",M(t));case 12:return R.a.warn("Content proxy could not return a result for: "+t+". The result was: "+JSON.stringify(r)),R.a.info(typeof r),"string"!==typeof r&&R.a.info("Ok"===r.rpc_status.toString()),e.abrupt("return",new E(JSON.stringify(r)));case 16:return e.abrupt("return",n);case 17:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),U=function(e,t){if("string"!==typeof t&&"Ok"===t.rpc_status.toString()){var n=F(e),r={moderation_status:t.result.moderation_status,categories:t.result.categories};return localStorage.setItem(n,JSON.stringify(r)),R.a.info("Cache save: "+n+JSON.stringify(r)),!0}return!1},M=function(e){var t=F(e),n=localStorage.getItem(t);if(null==n)return R.a.info("Cache miss: "+t),new E("Item not found in local storage: "+e);var r=JSON.parse(n);return R.a.info("Cache hit: "+t),r},q=function(e){var t=e.map((function(e){return P(e)})).map((function(t,n){return{url:e[n],result:t}}));return new Map(t.map((function(e){return[e.url,e.result]})))};function B(e,t){Array.from(e).map((function(e){return function(e,t){var n=e[0];return e[1].then((function(e){"moderation_status"in e&&t(n,e)}))}(e,t)}))}function V(e){return e.startsWith("ipfs://")?"https://tezori.infura-ipfs.io/ipfs/"+e.substring(7):e}var X=function(e){return{query:'\n        query LatestEvents {\n          holdings(limit: 100, where: {holder_address: {_eq: "'.concat(e,'"}}) {\n            holder_address\n            token {\n              artist_profile {\n                account\n                alias\n              }\n              artifact_uri\n              description\n              name\n              platform\n              mime_type\n            }\n          }\n        }\n        ')}},G=function(){var e=Object(s.a)(l.a.mark((function e(t){var n,r,a,i,c;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("https://api.teztok.com/v1/graphql",{method:"post",body:JSON.stringify(X(t)),headers:{Accept:"application/json","Content-Type":"application/json","Content-Length":JSON.stringify(X(t)).length.toString()},credentials:"include"});case 2:return n=e.sent,e.next=5,n.json();case 5:return r=e.sent,i=I(a=r),c=a.data.holdings.map((function(e,t){return{url:i[t],holding:e}})),e.abrupt("return",new Map(c.map((function(e){return[e.url,e.holding]}))));case 10:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),I=function(e){return e.data.holdings.map((function(e){return e.token.artifact_uri}))};function K(e){return Array.from(e.keys()).filter((function(e){return null!==e}))}function D(e){return K(e).filter((function(t){return function(e,t){var n=e.get(t);return null!==(null===n||void 0===n?void 0:n.token.mime_type)&&(null===n||void 0===n||!n.token.mime_type.includes("xml"))&&(null===n||void 0===n?void 0:n.token.mime_type.includes("image"))}(e,t)}))}function H(e){return K(e).filter((function(t){return function(e,t){var n=e.get(t);return null!==(null===n||void 0===n?void 0:n.token.mime_type)&&(null===n||void 0===n?void 0:n.token.mime_type.includes("video"))}(e,t)}))}function Y(){var e=Object(a.useContext)(O).globalState,t=Object(a.useState)([]),n=Object(u.a)(t,2),r=n[0],i=n[1],c=Object(a.useState)([]),o=Object(u.a)(c,2),f=o[0],d=o[1],p=Object(a.useState)(new Map),b=Object(u.a)(p,2),h=b[0],g=b[1],m=Object(a.useState)(new Map),v=Object(u.a)(m,2)[1],x=Object(a.useState)(!0),y=Object(u.a)(x,2),k=y[0],S=y[1],w=function(){var e=Object(s.a)(l.a.mark((function e(t){var n,r,a,c,o,s,u,f;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return f=function(e,t){s.push(e),u.set(e,t)},R.a.info("Fetching NFT content for "+t),R.a.info("Getting NFT data from TezTok"),e.next=5,G(t);case 5:n=e.sent,r=K(n),a=D(n),c=H(n),R.a.info("TezTok URLs: "+JSON.stringify(r)),R.a.info("TezTok image URLs: "+JSON.stringify(a)),R.a.info("TezTok video URLs: "+JSON.stringify(c)),R.a.info("Fetching moderation results from content proxy"),o=q(a),R.a.info("Rendering images.."),s=[],u=new Map,B(o,f),v(n),i(s),d(c),g(u);case 22:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();Object(a.useEffect)((function(){w(e.address).then((function(e){return e}))}),[e]);var _=function(e){if(!h.has(e))return V(e);var t=h.get(e);return("undefined"===typeof t||"moderation_status"in t)&&t.categories.length>0&&k?"https://upload.wikimedia.org/wikipedia/commons/3/39/Hazard_T.svg":V(e)};return Object(j.jsxs)("div",{children:[Object(j.jsxs)("h1",{children:["Gallery for ",e.address]}),Object(j.jsx)("input",{type:"checkbox",id:"moderation-toggle",checked:k,onChange:function(){S(!k)}}),Object(j.jsx)("label",{htmlFor:"scales",children:"Content moderation?"}),Object(j.jsx)("p",{}),r.concat(f).sort().map((function(e){return r.includes(e)?Object(j.jsx)("img",{src:_(e),alt:"",className:"gallery-image"},e):Object(j.jsx)("video",{src:_(e),className:"gallery-image",muted:!0,loop:!0,controls:!0},e)}))]})}function Z(){return R.a.useDefaults(),Object(j.jsxs)("div",{children:[Object(j.jsx)(x,{}),Object(j.jsxs)("div",{children:[Object(j.jsx)(w,{}),Object(j.jsx)(Y,{}),Object(j.jsx)(y,{})]})]})}o.a.createRoot(document.getElementById("root")).render(Object(j.jsx)(i.a.StrictMode,{children:Object(j.jsx)(g,{address:"",apiKey:"",derivationPath:"",network:"",tezosServer:"",beaconClient:null,children:Object(j.jsx)(Z,{})})}))}},[[424,1,2]]]);
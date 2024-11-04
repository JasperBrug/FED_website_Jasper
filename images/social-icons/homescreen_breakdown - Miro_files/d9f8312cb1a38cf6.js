"use strict";var miro=(()=>{var e=Object.defineProperty,t=Object.getOwnPropertyDescriptor,s=Object.getOwnPropertyNames,r=Object.prototype.hasOwnProperty,i=(t,s)=>e(t,"name",{value:s,configurable:!0}),n=(t,s)=>{for(var r in s)e(t,r,{get:s[r],enumerable:!0})},a={};n(a,{board:()=>eJ,clientVersion:()=>eK});var o=Symbol("EventManager"),c=Symbol("Commander"),d={};n(d,{attachDragAndDropListeners:()=>M,detachDragAndDropListeners:()=>R,initDragSensor:()=>f,resetDragSensor:()=>T});var h=["drag","drop","dragend","dragstart"],l={"pointer-events":"none","user-select":"none","-webkit-user-select":"none","-webkit-touch-callout":"none"},u=class e{constructor(){this.listeners=[],this.originalBodyStyle={},this.dragStartPosition={x:-1/0,y:-1/0}}setDragStartPosition(e,t){this.dragStartPosition={x:e,y:t}}shouldDispatchDrag(t,s){return Math.abs(t-this.dragStartPosition.x)>e.DRAG_THRESHOLD||Math.abs(s-this.dragStartPosition.y)>e.DRAG_THRESHOLD}resetDragging(){throw Error("Not implemented")}addListener(e,t,s){this.listeners.push({type:e,selector:t,handler:s})}removeListener(e,t,s){this.listeners=this.listeners.filter(r=>r.type!==e||null!=t&&r.selector!==t||null!=s&&r.handler!==s)}isDraggableElement(e){return!!(e instanceof HTMLElement||e instanceof SVGElement)&&this.listeners.some(({selector:t})=>!!e.closest(t))}disableClickEvents(){Object.entries(l).forEach(([e,t])=>{this.originalBodyStyle[e]=document.body.style.getPropertyValue(e),document.body.style.setProperty(e,t)})}restoreClickEvents(){Object.entries(this.originalBodyStyle).forEach(([e,t])=>{document.body.style.setProperty(e,t)}),this.originalBodyStyle={}}dragEnd(e){this.dispatch("dragend",{target:e,clientX:NaN,clientY:NaN,screenX:NaN,screenY:NaN})}dispatch(e,t){this.listeners.forEach(({selector:s,handler:r,type:i})=>{if(e!==i)return;let n=t.target.closest(s);n&&r(new CustomEvent(e,{detail:{...t,target:n,type:e}}))})}};i(u,"BaseDragSensor"),u.DRAG_THRESHOLD=8;var m=u,g=class extends m{constructor(){super(),this.isDragging=!1,this.onMouseDown=i(e=>{let t=e.target;this.isDraggableElement(t)&&(t.setAttribute("draggable","false"),this.target=t,this.setDragStartPosition(e.clientX,e.clientY),document.addEventListener("mouseup",this.onMouseUp),document.addEventListener("mousemove",this.onMouseMove,{passive:!0}))},"onMouseDown"),this.onMouseMove=i(e=>{if(!this.target)return;let{clientX:t,clientY:s,screenX:r,screenY:i}=e;if(!this.isDragging&&!this.shouldDispatchDrag(t,s))return;let n=this.isDragging?"drag":"dragstart";this.isDragging||this.disableClickEvents(),this.isDragging=!0,this.dispatch(n,{target:this.target,clientX:t,clientY:s,screenX:r,screenY:i})},"onMouseMove"),this.onMouseUp=i(e=>{if(e.preventDefault(),this.isDragging&&this.target){let{clientX:t,clientY:s,screenX:r,screenY:i}=e;this.dispatch("drop",{target:this.target,clientX:t,clientY:s,screenX:r,screenY:i})}window.requestAnimationFrame(()=>this.resetDragging())},"onMouseUp"),this.resetDragging=i(()=>{document.removeEventListener("mouseup",this.onMouseUp),document.removeEventListener("mousemove",this.onMouseMove),this.isDragging&&this.target&&this.dragEnd(this.target),this.target&&this.restoreClickEvents(),this.isDragging=!1,this.target=void 0},"resetDragging"),document.addEventListener("mousedown",this.onMouseDown),window.addEventListener("blur",this.resetDragging)}};i(g,"MouseDragSensor");var p=!1;window.addEventListener?.("touchmove",e=>{p&&e.preventDefault()},{passive:!1});var y=class extends m{constructor(){super(),this.onTouchStart=i(e=>{let{target:t}=e;if(!this.isDraggableElement(t))return;let s=e.touches[0];if(!s)return;let{clientX:r,clientY:i,screenX:n,screenY:a}=s;this.setDragStartPosition(r,i),t.setAttribute("draggable","false"),this.target=t,this.tapTimeout=window.setTimeout(()=>{this.startDragging({target:t,clientX:r,clientY:i,screenX:n,screenY:a})},100),window.addEventListener("touchend",this.onTouchEnd),window.addEventListener("touchcancel",this.resetDragging),window.addEventListener("touchmove",this.resetDragging)},"onTouchStart"),this.onTouchMove=i(e=>{if(!this.target)return;let t=e.touches[0];if(!t)return;let{clientX:s,clientY:r,screenX:i,screenY:n}=t;this.dispatch("drag",{target:this.target,clientX:s,clientY:r,screenX:i,screenY:n})},"onTouchMove"),this.onTouchEnd=i(e=>{if(p&&this.target){let t=e.changedTouches[0];if(!t)return;let{clientX:s,clientY:r,screenX:i,screenY:n}=t;this.dispatch("dragend",{target:this.target,clientX:s,clientY:r,screenX:i,screenY:n})}window.requestAnimationFrame(()=>this.resetDragging())},"onTouchEnd"),this.startDragging=i(e=>{this.shouldDispatchDrag(e.clientX,e.clientY)&&(window.removeEventListener("touchmove",this.resetDragging),window.addEventListener("touchmove",this.onTouchMove,{passive:!0}),p=!0,this.disableClickEvents(),this.dispatch("dragstart",e))},"startDragging"),this.resetDragging=i(()=>{window.removeEventListener("touchend",this.onTouchEnd),window.removeEventListener("touchcancel",this.resetDragging),window.removeEventListener("touchmove",this.resetDragging),window.removeEventListener("touchmove",this.onTouchMove),p&&this.target&&(this.restoreClickEvents(),this.dragEnd(this.target)),this.target=void 0,p=!1,void 0!==this.tapTimeout&&(clearTimeout(this.tapTimeout),this.tapTimeout=void 0)},"resetDragging"),window.addEventListener("touchstart",this.onTouchStart),window.addEventListener("blur",this.resetDragging)}};i(y,"TouchDragSensor");var E=class{constructor(e){this.touchSensor=new y,this.mouseSensor=new g,Object.assign(this,e)}addListener(e,t){this.mouseSensor.addListener(e,this.selector,t),this.touchSensor.addListener(e,this.selector,t)}removeListener(e,t){this.mouseSensor.removeListener(e,void 0,t),this.touchSensor.removeListener(e,void 0,t)}reset(){h.forEach(e=>{this.mouseSensor.removeListener(e),this.touchSensor.removeListener(e)})}resetDragging(){this.mouseSensor.resetDragging(),this.touchSensor.resetDragging()}};i(E,"DragSensor");var w,v,f=i(()=>{w?.reset(),w=new E({selector:".miro-draggable"})},"initDragSensor"),T=i(()=>w?.reset(),"resetDragSensor"),b="internal:drop",_=new Set,I=new Map;async function S(e){let t=e.payload;if(null==t)return;let{x:s,y:r}=t,i={x:s,y:r,target:v};_.forEach(e=>e(i)),w.resetDragging()}i(S,"handleInternalDrop");var x,O=i(e=>async t=>{let{clientX:s,clientY:r,target:i}=t.detail,n=(v=i).dataset.dragPreview,a=parseInt(v.dataset.dragPreviewWidth??"",10),o=parseInt(v.dataset.dragPreviewHeight??"",10);await e.exec("UI_DRAG_START",{clientX:s,clientY:r,dragImage:n?{width:a===Number.NaN?void 0:a,height:o===Number.NaN?void 0:o,src:n}:void 0})},"onDragStart"),D=i(e=>async t=>{if(x)return;x=requestAnimationFrame(()=>{x=void 0});let{clientX:s,clientY:r}=t.detail;await e.exec("UI_DRAG_MOVE",{clientX:s,clientY:r})},"onDrag"),A=i(e=>async t=>{let{clientX:s,clientY:r}=t.detail;await e.exec("UI_DRAG_DROP",{clientX:s,clientY:r})},"onDrop"),N=i(e=>async t=>{await e.exec("UI_DRAG_END")},"onDragEnd");async function M(e,t){0===_.size&&(await e.exec("UI_REGISTER_EVENT",{name:b}),e.subscribe(b,S),I.set("dragstart",O(e)),I.set("drag",D(e)),I.set("dragend",N(e)),I.set("drop",A(e)),w.addListener("dragstart",I.get("dragstart")),w.addListener("drag",I.get("drag")),w.addListener("dragend",I.get("dragend")),w.addListener("drop",I.get("drop"))),_.add(t)}async function R(e,t){_.delete(t),0===_.size&&(w.removeListener("dragstart",I.get("dragstart")),w.removeListener("drag",I.get("drag")),w.removeListener("dragend",I.get("drag")),w.removeListener("drop",I.get("drop")),e.unsubscribe(b,S),await e.exec("UI_UNREGISTER_EVENT",{name:b}))}function L(e){return null!=e&&"object"==typeof e&&!Array.isArray(e)&&!(e instanceof Blob)}function C(e,...t){if(!t.length)return e;let s=t.shift();return L(e)&&L(s)&&Object.keys(s).forEach(t=>{L(s[t])?(e[t]||Object.assign(e,{[t]:{}}),C(e[t],s[t])):Object.assign(e,{[t]:s[t]})}),C(e,...t)}function G(e){let t={};return Object.keys(e).forEach(s=>{let r=e[s];"function"!=typeof r&&(t[s]=r)}),t}i(M,"attachDragAndDropListeners"),i(R,"detachDragAndDropListeners"),i(L,"isObject"),i(C,"mergeDeep"),i(G,"asProps");var P={"89504e47":"image/png",47494638:"image/gif",ffd8ffdb:"image/jpeg",ffd8ffe0:"image/jpeg",ffd8ffe1:"image/jpeg","424d":"image/bmp",38425053:"image/vnd.adobe.photoshop","3c3f786d":"image/svg+xml","3c737667":"image/svg+xml"};function U(e){let t=-1!==e.indexOf("base64")?e.split(";base64,").pop():e,s="";try{s=atob(t).trim()}catch{return e}let r="";for(let e=0;e<4;e++)r+=`0${s.charCodeAt(e).toString(16)}`.slice(-2);for(let e in P)if(r.startsWith(e))return`data:${P[e]};base64,${t}`;return e}i(U,"normalizeDataUrl");var F=i(async e=>new Promise((t,s)=>{let r=new FileReader;r.onload=()=>{t(U(r.result?.toString()??""))},r.onerror=()=>{s(r.error)},r.onabort=()=>{s(Error("Aborted"))},r.readAsDataURL(e)}),"blobToDataUrl");function k(){return Math.random().toString(36).slice(-10)}function W(e){return e instanceof ArrayBuffer}async function B(e){if(!e)return[];if(e instanceof Blob)return[await e.arrayBuffer()];if(W(e))return[e];if("object"!=typeof e)return[];let t=Object.values(e).map(e=>"object"==typeof e&&null!==e?B(e):Promise.resolve([]));return(await Promise.all(t)).flat()}i(k,"generateId"),i(W,"isTransferableObject"),i(B,"getTransferable");var j="sdkv2-plugin-message";function V(e){return null!==e&&"window"in e}function Y(e){return!(e.data?.commandId!==j||!Array.isArray(e.data?.payload))}i(V,"isWindow"),i(Y,"isSdkMessage");var X=class{constructor(e,t,s,r){this.hostWindow=e,this.clientOrigin=t,this.messageHandler=s,this.windowGetter=r,this.waiting=new Map,this.handlePostMessage=i(e=>{if("*"!==this.clientOrigin&&e.origin!==this.clientOrigin||!Y(e)||!V(e.source)||e.source!==this.windowGetter())return;let{msgId:t,payload:s}=e.data,r=this.waiting.get(t);if(r)this.waiting.delete(t),r.resolve(s);else{let e=i(e=>{e&&this.dispatch(e,t)},"after");this.messageHandler(s).then(e).catch(e)}},"handlePostMessage")}init(){this.hostWindow.addEventListener("message",this.handlePostMessage)}destroy(){this.waiting.clear(),this.hostWindow.removeEventListener("message",this.handlePostMessage)}dispatch(e,t){return new Promise((s,r)=>B(e).then(i=>{if(!this.windowGetter())return;let n=!t,a=n?k():t;this.windowGetter().postMessage({commandId:j,payload:e,msgId:a},this.clientOrigin,i),n?this.waiting.set(a,{resolve:s,reject:r}):(this.waiting.delete(a),s(null))}).catch(r))}};i(X,"SdkPostMessageBus");var H=class{constructor(e,t){this.prefix=t,this.waitingResponse=new Map,this.handlers=new Map,this.responseHandler=i(e=>{for(let t=0;t<e.length;t++){let s=e[t];if(!s)continue;let r=this.waitingResponse.get(s.id);r&&("S"===s.status?r.resolve(s.payload):"F"===s.status&&r.reject(Error(String(s.payload))),this.waitingResponse.delete(s.id))}return Promise.resolve([])},"responseHandler"),this.handle=i(e=>{let t=[];for(let s=0;s<e.length;s++){let r=e[s];if(r?.status){this.responseHandler([r]);continue}let i=r&&this.handlers.get(r.id);i&&i.forEach(e=>{t.push(e(r))})}return Promise.all(t).catch(e=>(console.error(e),e))},"handle"),this.bus=new X(e,"*",this.handle,()=>e.parent),this.bus.init()}destroy(){this.bus.destroy()}async exec(e,t){let s=k(),r=[{name:this.prefix?`${this.prefix.toUpperCase()}_${e}`:e,payload:t,id:s}];return new Promise((e,t)=>{this.waitingResponse.set(s,{resolve:e,reject:t}),this.bus.dispatch(r).then(this.responseHandler)})}subscribe(e,t){let s=this.handlers.get(e)||[];this.handlers.set(e,[...s,t])}unsubscribe(e,t){let s=(this.handlers.get(e)||[]).filter(e=>e!==t);0===s.length?this.handlers.delete(e):this.handlers.set(e,s)}hasEventSubscriptions(e){return this.handlers.has(e)}};i(H,"IframeCommander");var $=class{constructor(e,t){this.realCommander=e,this.prefix=t}exec(e,t){let s=`${this.prefix.toUpperCase()}_${e}`;return this.realCommander.exec(s,t)}subscribe(e,t){this.realCommander.subscribe(e,t)}unsubscribe(e,t){this.realCommander.unsubscribe(e,t)}hasEventSubscriptions(e){return this.realCommander.hasEventSubscriptions(e)}};i($,"CommanderProxy");var z=i((e,t,s)=>{Object.defineProperty(e,t,{enumerable:!1,writable:!1,configurable:!1,value:s})},"setPrivateField"),Z=Symbol("context"),K=i(e=>e.startsWith("custom:"),"isCustomEvent"),q=class{constructor(e){this.commander=e,this.subscriptionsMap=new Map}async subscribe(e,t,s){this.addInternalHandler(e,t,s),this.commander.hasEventSubscriptions(e)||await this.commander.exec("UI_REGISTER_EVENT",{name:e}),this.commander.subscribe(e,s)}async unsubscribe(e,t){let s=this.subscriptionsMap.get(e),r=s?.get(t);s&&r&&(s.delete(t),this.commander.unsubscribe(e,r),this.commander.hasEventSubscriptions(e)||await this.commander.exec("UI_UNREGISTER_EVENT",{name:e}))}async unsubscribeAll(){this.subscriptionsMap.forEach((e,t)=>{e.forEach(e=>{this.commander.unsubscribe(t,e)})});let e=[...this.subscriptionsMap.keys()].filter(e=>!this.commander.hasEventSubscriptions(e)).map(e=>this.commander.exec("UI_UNREGISTER_EVENT",{name:e}));return this.subscriptionsMap.clear(),Promise.all(e)}addInternalHandler(e,t,s){this.subscriptionsMap.has(e)||this.subscriptionsMap.set(e,new Map),this.subscriptionsMap.get(e)?.set(t,s)}};i(q,"EventManager");var J=class{constructor(e){z(this,Z,e),z(this,o,new q(e.commander))}async openPanel(e){await this[Z].commander.exec("UI_OPEN_PANEL",e);let t=this[Z].commander.exec("UI_WAIT_FOR_PANEL_CLOSE",e);return{waitForClose:()=>t}}async getPanelData(){return this[Z].commander.exec("UI_GET_PANEL_DATA")}async canOpenPanel(){return this[Z].commander.exec("UI_CAN_OPEN_PANEL")}async closePanel(e){await this[Z].commander.exec("UI_CLOSE_PANEL",{result:e})}async openModal(e){await this[Z].commander.exec("UI_OPEN_MODAL",e);let t=this[Z].commander.exec("UI_WAIT_FOR_MODAL_CLOSE",e);return{waitForClose:()=>t}}async getModalData(){return this[Z].commander.exec("UI_GET_MODAL_DATA")}async closeModal(e){await this[Z].commander.exec("UI_CLOSE_MODAL",{result:e})}async canOpenModal(){return this[Z].commander.exec("UI_CAN_OPEN_MODAL")}on(e,t){switch(e){case"drop":return M(this[Z].commander,t),Promise.resolve();case"icon:click":return this[o].subscribe(e,t,async()=>t());case"app_card:open":return this[o].subscribe(e,t,async e=>{let{appCard:s}=e.payload;return t({appCard:this[Z].convert(s)})});case"app_card:connect":return this[o].subscribe(e,t,async e=>{let{appCard:s}=e.payload;return t({appCard:this[Z].convert(s)})});case"selection:update":return this[o].subscribe(e,t,async e=>{let{items:s}=e.payload;return t({items:s.map(e=>this[Z].convert(e))})});case"online_users:update":return this[o].subscribe(e,t,async e=>t(e.payload));case"items:create":return this[o].subscribe(e,t,async e=>{let{items:s}=e.payload;return t({items:s.map(e=>this[Z].convert(e))})});case"experimental:items:update":return this[o].subscribe(e,t,async e=>{let{items:s}=e.payload;return t({items:s.map(e=>this[Z].convert(e))})});case"items:delete":return this[o].subscribe(e,t,async e=>{let{items:s}=e.payload;return t({items:s.map(e=>this[Z].convert(e))})});default:if(K(e)){let s=i(async e=>{let{items:s}=e.payload;return t({items:s.map(e=>this[Z].convert(e))})},"internalHandler");return this[o].subscribe(e,t,s)}throw Error(`unknown event: ${e}`)}}off(e,t){switch(e){case"drop":return R(this[Z].commander,t),Promise.resolve();case"icon:click":case"app_card:open":case"app_card:connect":case"selection:update":case"online_users:update":case"items:create":case"experimental:items:update":case"items:delete":return this[o].unsubscribe(e,t);default:if(K(e))return this[o].unsubscribe(e,t);throw Error(`unknown event: ${e}`)}}};i(J,"BoardUI");var Q=class{constructor(e){z(this,c,e)}async showInfo(e){await this[c].exec("SHOW_NOTIFICATION",{message:e,type:"info"})}async showError(e){await this[c].exec("SHOW_NOTIFICATION",{message:e,type:"error"})}async show(e){await this[c].exec("SHOW_NOTIFICATION",e)}};i(Q,"Notifications");var ee=class{constructor(e){z(this,c,e)}async get(){return this[c].exec("VIEWPORT_GET")}async set(e){return this[c].exec("VIEWPORT_SET",e)}async zoomTo(e){return Array.isArray(e)?this[c].exec("VIEWPORT_ZOOM_TO",{items:e.map(e=>e.id)}):this.zoomTo([e])}async getZoom(){return this[c].exec("VIEWPORT_GET_ZOOM")}async setZoom(e){return this[c].exec("VIEWPORT_SET_ZOOM",{zoomLevel:e})}};i(ee,"Viewport");var et=i(e=>`realtime_event:${e}`,"prefixed"),es=class{constructor(e){z(this,c,e),z(this,o,new q(e))}async broadcast(e,t){await this[c].exec("SEND_REALTIME_BROADCAST_EVENT",{event:e,payload:t})}on(e,t){let s=i(async e=>{t(e.payload)},"internalHandler"),r=et(e);return this[o].subscribe(r,t,s)}off(e,t){let s=et(e);return this[o].unsubscribe(s,t)}};i(es,"RealtimeEvents");var er=i(e=>`timer:${e}`,"prefixed"),ei=class{constructor(e){z(this,c,e),z(this,o,new q(e))}async get(){return this[c].exec("TIMER_GET")}async start(e){return this[c].exec("TIMER_START",{duration:e})}async stop(){return this[c].exec("TIMER_STOP")}async pause(){return this[c].exec("TIMER_PAUSE")}async resume(){return this[c].exec("TIMER_RESUME")}async prolong(e){return this[c].exec("TIMER_PROLONG",{duration:e})}async isStarted(){return this[c].exec("TIMER_IS_STARTED")}async on(e,t){let s=i(async e=>{t(e.payload)},"internalHandler"),r=er(e);return this[o].subscribe(r,t,s)}async off(e,t){let s=er(e);return this[o].unsubscribe(s,t)}};i(ei,"Timer");var en=class{constructor(e){z(this,c,e)}async follow(e,t={}){let s={followee:e,...t};await this[c].exec("ATTENTION_FOLLOW",s)}async isFollowing(){return this[c].exec("ATTENTION_IS_FOLLOWING")}async getFollowedUser(){return this[c].exec("ATTENTION_GET_FOLLOWED_USER")}async unfollow(e){await this[c].exec("ATTENTION_UNFOLLOW",e)}};i(en,"Attention");var ea=class{constructor(e,t,s,r,i,n,a){this.id=e,this.name=t,this.description=s,this.color=r,this.starterId=i,this.starterName=n,z(this,c,a),z(this,o,new q(a))}async invite(...e){await this[c].exec("SESSIONS_INVITE_USERS",{sessionId:this.id,userIds:e.flat().map(e=>e.id)})}async join(){await this[c].exec("SESSIONS_JOIN",{sessionId:this.id})}async leave(){await this[c].exec("SESSIONS_LEAVE",{sessionId:this.id})}getUsers(){throw Error("Method not implemented.")}async hasJoined(e){return this[c].exec("SESSIONS_USER_JOINED",{sessionId:this.id,userId:e})}async on(e,t){if("user-left"!==e&&"user-joined"!==e&&"invitation-responded"!==e)return;let s=i(async e=>{e.payload.sessionId===this.id&&await t(e.payload)},"wrappedHandler"),r=`sessions:${e}`;await this[o].subscribe(r,t,s)}async off(e,t){if("user-left"!==e&&"user-joined"!==e&&"invitation-responded"!==e)return;let s=`sessions:${e}`;await this[o].unsubscribe(s,t)}async end(){await this[c].exec("SESSIONS_END",{id:this.id}),await this[o].unsubscribeAll()}};i(ea,"Session");var eo=class{constructor(e){this.attention=new en(e),z(this,c,e),z(this,o,new q(e))}async startSession(e){let t=await this[c].exec("SESSIONS_START",e);return new ea(t.id,t.name,t.description,t.color,t.starterId,t.starterName,this[c])}async getSessions(){return(await this[c].exec("SESSIONS_GET")).map(e=>new ea(e.id,e.name,e.description,e.color,e.starterId,e.starterName,this[c]))}async on(e,t){if("sessions:started"!==e&&"sessions:ended"!==e)throw Error(`${e} does not exist`);let s=i(async e=>{await t(e.payload)},"wrappedHandler");return this[o].subscribe(e,t,s)}async off(e,t){if("sessions:started"!==e&&"sessions:ended"!==e)throw Error(`${e} does not exist`);return this[o].unsubscribe(e,t)}async zoomTo(e,t){return Array.isArray(t)?this[c].exec("COLLABORATION_VIEWPORT_ZOOM_TO",{items:t.map(e=>e.id),user:e}):this.zoomTo(e,[t])}};i(eo,"Collaboration");var ec=i((e,t)=>`storage:change:${e}:${t}`,"prefixed"),ed=class{constructor(e,t,s){this.name=e,z(this,c,t),z(this,o,s)}async set(e,t){return this[c].exec("STORAGE_SET",{collection:this.name,key:e,value:t})}async get(e){return(await this[c].exec("STORAGE_GET",{collection:this.name,key:e})).value}async remove(e){return this[c].exec("STORAGE_REMOVE",{collection:this.name,key:e})}async onValue(e,t){let s=await this[c].exec("STORAGE_GET",{collection:this.name,key:e});t(s?.value,s?.version);let r=i(async e=>{let{value:s,version:r}=e.payload;return t(s,r)},"internalHandler"),n=ec(this.name,e);return this[o].subscribe(n,t,r)}async offValue(e,t){let s=ec(this.name,e);return this[o].unsubscribe(s,t)}};i(ed,"Collection");var eh=class{constructor(e){z(this,c,e),z(this,o,new q(e))}collection(e){return new ed(e,this[c],this[o])}};i(eh,"Storage");var el=i(async(e,t)=>{let s=await e.commander.exec("WIDGET_GET",t);if(!Array.isArray(s))throw Error("Error retrieving items");return s.map(t=>e.convert(t))},"getItems"),eu=class{constructor(e,t){z(this,Z,e)}async sync(){C(this,await this[Z].commander.exec("WIDGET_UPDATE",this))}async getMetadata(e){return this[Z].commander.exec("WIDGET_GET_METADATA",{itemId:this.id,key:e})}async setMetadata(e,t){return this[Z].commander.exec("WIDGET_SET_METADATA",{itemId:this.id,key:e,value:t})}async goToLink(){return this[Z].commander.exec("WIDGET_GO_TO_LINK",{itemId:this.id})}async bringToFront(){return this[Z].commander.exec("BRING_TO_FRONT",{items:[this.id]})}async sendToBack(){return this[Z].commander.exec("SEND_TO_BACK",{items:[this.id]})}async bringInFrontOf(e){return this[Z].commander.exec("BRING_IN_FRONT_OF",{items:[this.id],targetId:e.id})}async sendBehindOf(e){return this[Z].commander.exec("SEND_BEHIND_OF",{items:[this.id],targetId:e.id})}async getLayerIndex(){return this[Z].commander.exec("GET_LAYER_INDEX",{itemId:this.id})}async getConnectors(){let{connectorIds:e}=this;return e&&0!==e.length?el(this[Z],{type:"connector",id:e}):[]}};i(eu,"BaseItem");var em=eu,eg=class extends em{constructor(e,t){super(e,t),Object.assign(this,t)}};function ep(e){return e.replace(/(?:^|_)([a-z])/g,(e,t)=>t.toUpperCase())}function ey(e){return!e.create}function eE(e){return ey(e)?{constructor:e,create:async(t,s)=>{let r=new e(t,s),i=G(r);return C(r,await t.commander.exec("WIDGET_CREATE",i)),r}}:e}function ew(e){let t=[...e?.getRegisteredFeatures()??[]],s=e?new Map(e.getRegisteredWidgets()):new Map,r=i(()=>({widget:(e,t)=>(s.set(e,t),r()),use:e=>(t.push(e),r()),getRegisteredFeatures:()=>t,getRegisteredWidgets:()=>s,build(e){let r=Object.create({}),i={convert(e){let{type:t}=e;if(s.get(t)){let{constructor:r}=eE(s.get(t));if(r)return new r(i,e)}return new eg(this,e)},get commander(){return e}};return s.forEach((e,t)=>{let{create:s}=eE(e);Object.assign(r,{[`create${ep(t)}`]:e=>s(i,e)})}),t.forEach(e=>Object.assign(r,e(i))),r}}),"build");return r()}i(eg,"Unsupported"),i(ep,"toCamelCase"),i(ey,"isConstructor"),i(eE,"parseItemDeclaration"),i(ew,"buildSdkClient");var ev=i(e=>({get:async t=>el(e,t),async getById(t){let s=await el(e,{id:t});if(Array.isArray(s)&&s.length)return s[0];throw Error(`Can not retrieve item with id ${t}`)},getSelection:async()=>(await e.commander.exec("GET_SELECTION")).map(t=>e.convert(t)),select:async t=>(await e.commander.exec("SELECT_WIDGETS",t)).map(t=>e.convert(t)),deselect:async t=>(await e.commander.exec("DESELECT_WIDGETS",t)).map(t=>e.convert(t))}),"baseClientFeature"),ef=class{constructor(e,t){this.type="connector",this.shape="curved",this.start=void 0,this.end=void 0,this.style={},this.captions=[],z(this,Z,e),C(this,t)}async sync(){C(this,await this[Z].commander.exec("WIDGET_UPDATE",this))}async getMetadata(e){return this[Z].commander.exec("WIDGET_GET_METADATA",{itemId:this.id,key:e})}async setMetadata(e,t){return this[Z].commander.exec("WIDGET_SET_METADATA",{itemId:this.id,key:e,value:t})}};i(ef,"Connector");var eT=i(e=>({type:"text",content:e.content,style:{fontSize:e.style.fontSize}}),"viewTransformText"),eb=i(e=>({type:"shape",shape:e.shape,content:e.content,style:{color:e.style.color,fontSize:e.style.fontSize,fillOpacity:e.style.fillOpacity,borderStyle:e.style.borderStyle}}),"viewTransformShape"),e_=i(e=>"shape"===e.type?eb(e):"text"===e.type?eT(e):{},"transformNodeView"),eI=class extends em{constructor(e,t){super(e,t),this.type="mindmap_node",C(this,t)}async sync(){return this.nodeView=e_(this.nodeView),super.sync()}async add(e){this.childrenIds.push(e.id),await this.sync();let[t]=await el(this[Z],{id:e.id});return C(e,t),e}async getChildren(){let e=this.childrenIds;return 0===e.length?[]:el(this[Z],{id:e})}};i(eI,"MindmapNode");var eS=class{constructor(e){this.type="mindmap_node",C(this,e)}};i(eS,"MindmapNodeCreate");var ex={constructor:eI,create:async(e,t)=>{let s=await e.commander.exec("WIDGET_CREATE",new eS(t??{}));return new eI(e,s)}},eO=class extends em{constructor(e,t){super(e,t),this.type="shape",this.content="",this.shape="rectangle",this.style={fillColor:"transparent",fontFamily:"arial",fontSize:14,textAlign:"center",textAlignVertical:"middle",borderStyle:"normal",borderOpacity:1,borderColor:"#1a1a1a",borderWidth:2,fillOpacity:1,color:"#1a1a1a"},C(this,t)}};async function eD(e,t){let s=G(t);return C(t,await e.commander.exec("WIDGET_CREATE",s)),t}i(eO,"Shape"),i(eD,"sendCreate");var eA=class{constructor(e,t){this.type="group",this.itemsIds=[],z(this,Z,e),C(this,t)}async sync(){throw Error("Not implemented yet.")}async getItems(){let e=this[Z];return(await e.commander.exec("GROUP_GET_ITEMS",{id:this.id})).map(t=>e.convert(t))}async ungroup(){let e=this[Z];return(await e.commander.exec("GROUP_UNGROUP",{id:this.id})).map(t=>e.convert(t))}};i(eA,"BaseGroup");var eN=eA,eM=class extends eN{};i(eM,"Group");var eR=i(e=>({sync:async e=>e.sync(),async remove(t){let{id:s,type:r}=t;await e.commander.exec("WIDGET_REMOVE",{id:s,type:r})},getInfo:async()=>e.commander.exec("GET_BOARD_INFO"),getIdToken:async()=>e.commander.exec("GET_ID_TOKEN"),canUse:async t=>e.commander.exec("CHECK_FEATURE_ENTITLEMENT",{feature:t}),getAppData:async t=>e.commander.exec("GET_BOARD_APP_DATA",{key:t}),setAppData:async(t,s)=>e.commander.exec("SET_BOARD_APP_DATA",{key:t,value:s}),setMetadata:async(e,t,s)=>e.setMetadata(t,s),getMetadata:async(e,t)=>e.getMetadata(t),getUserInfo:async()=>e.commander.exec("GET_USER_INFO"),getOnlineUsers:async()=>e.commander.exec("GET_ONLINE_USERS"),async group(t){let{items:s}=t,r=s.map(e=>e.id),i=await eD(e,new eM(e,{itemsIds:r,type:"group"}));return await Promise.all(s.map(async t=>{let[s]=await el(e,{id:t.id});C(t,s)})),i},goToLink:async e=>e.goToLink(),async bringToFront(t){return Array.isArray(t)?e.commander.exec("BRING_TO_FRONT",{items:t.map(e=>e.id)}):this.bringToFront([t])},async sendToBack(t){return Array.isArray(t)?e.commander.exec("SEND_TO_BACK",{items:t.map(e=>e.id)}):this.sendToBack([t])},async bringInFrontOf(t,s){return Array.isArray(t)?e.commander.exec("BRING_IN_FRONT_OF",{items:t.map(e=>e.id),targetId:s.id}):this.bringInFrontOf([t],s)},async sendBehindOf(t,s){return Array.isArray(t)?e.commander.exec("SEND_BEHIND_OF",{items:t.map(e=>e.id),targetId:s.id}):this.sendBehindOf([t],s)},getLayerIndex:async e=>e.getLayerIndex(),findEmptySpace:async t=>e.commander.exec("FIND_EMPTY_SPACE",t)}),"boardFeature"),eL=class{constructor(e){z(this,c,e)}async register(e){return this[c].exec("CUSTOM_ACTION_REGISTER",e)}async deregister(e){await this[c].exec("CUSTOM_ACTION_DEREGISTER",e)}};i(eL,"CustomActionManagement");var eC=i(e=>({action:new eL(e.commander),getVotingResults:async()=>e.commander.exec("GET_VOTING_RESULTS"),group:async t=>eR(e).group(t)}),"boardFeature"),eG=class extends em{constructor(e,t){super(e,t),this.type="app_card",this.owned=!1,this.title="",this.description="",this.style={},this.tagIds=[],this.status="disconnected",this.fields=[],C(this,t)}};i(eG,"AppCard");var eP=class extends em{constructor(e,t){super(e,t),this.type="card",this.title="",this.description="",this.style={},this.dueDate=void 0,this.startDate=void 0,this.assignee=void 0,this.taskStatus="none",this.tagIds=[],this.fields=[],C(this,t)}};i(eP,"Card");var eU=class extends em{constructor(e,t){super(e,t),this.type="image",this.title="",this.alt="",C(this,t)}async getFile(e="original"){let t={id:this.id,format:e};return new File([await this[Z].commander.exec("IMAGE_GET_BLOB",t)],this.title,{lastModified:+this.modifiedAt})}async getDataUrl(e){let t=await this.getFile(e);return await F(t)}};i(eU,"Image");var eF=class extends em{constructor(e,t){super(e,t),this.type="preview",C(this,t)}};i(eF,"Preview");var ek=class extends em{constructor(e,t){super(e,t),this.type="shape",this.content="",this.shape="rectangle",this.style={fillColor:"transparent",fontFamily:"arial",fontSize:14,textAlign:"center",textAlignVertical:"middle",borderStyle:"normal",borderOpacity:1,borderColor:"#1a1a1a",borderWidth:2,fillOpacity:1,color:"#1a1a1a"},C(this,t)}};i(ek,"Shape");var eW=class extends em{constructor(e,t){super(e,t),this.type="sticky_note",this.shape="square",this.content="",this.style={fillColor:"light_yellow",textAlign:"center",textAlignVertical:"middle"},this.tagIds=[],C(this,t)}};i(eW,"StickyNote");var eB=class extends em{constructor(e,t){super(e,t),this.type="embed",this.previewUrl="",this.mode="inline",C(this,t)}};i(eB,"Embed");var ej=class extends em{constructor(e,t){super(e,t),this.type="frame",this.title="",this.childrenIds=[],this.style={fillColor:"transparent"},C(this,t)}async add(e){this.childrenIds.push(e.id),await this.sync();let[t]=await el(this[Z],{id:e.id});return C(e,t),e}async remove(e){let t=e.id;if(!t)throw Error("trying to remove a non-existent item from a frame");let s=this.childrenIds.findIndex(e=>e===t);if(-1===s)throw Error(`Can't remove item ${t} from frame ${this.id}. The item is not a current child`);this.childrenIds.splice(s,1),await this.sync();let[r]=await el(this[Z],{id:e.id});C(e,r)}async getChildren(){return(await this[Z].commander.exec("FRAME_GET_CHILDREN",{id:this.id})).map(e=>this[Z].convert(e))}};i(ej,"BaseFrame");var eV=ej,eY=class extends eV{};i(eY,"Frame");var eX=class extends em{constructor(e,t){super(e,t),this.type="text",this.content="",this.style={fillColor:"transparent",fillOpacity:1,fontFamily:"arial",fontSize:14,textAlign:"left",color:"#1a1a1a"},C(this,t)}};i(eX,"Text");var eH=class{constructor(e,t){this.type="tag",this.title="",this.color="red",z(this,Z,e),C(this,t)}async sync(){return this[Z].commander.exec("WIDGET_UPDATE",this).then(e=>{C(this,e)})}};i(eH,"Tag");var e$=ew().widget("app_card",eG).widget("card",eP).widget("connector",ef).widget("embed",eB).widget("frame",eY).widget("image",eU).widget("preview",eF).widget("shape",ek).widget("sticky_note",eW).widget("text",eX).widget("group",eM).widget("tag",eH).use(e=>({ui:new J(e),notifications:new Q(e.commander),viewport:new ee(e.commander),storage:new eh(e.commander),events:new es(e.commander),timer:new ei(e.commander),collaboration:new eo(e.commander)})).use(eR).use(ev),ez=ew(e$).use(({commander:e})=>({experimental:ew(e$).widget("mindmap_node",ex).widget("shape",eO).use(eC).build(new $(e,"experimental"))})),eZ=i(e=>ez.build(e),"createStableSdk"),eK="1.68213.0",eq=new H(window),eJ=eZ(eq);return eq.exec("handshake",{clientVersion:eK}),d.initDragSensor(),"u">typeof location&&new URLSearchParams(location.search).has("autotest"),((i,n,a,o)=>{if(n&&"object"==typeof n||"function"==typeof n)for(let a of s(n))r.call(i,a)||void 0===a||e(i,a,{get:()=>n[a],enumerable:!(o=t(n,a))||o.enumerable});return i})(e({},"__esModule",{value:!0}),a)})();
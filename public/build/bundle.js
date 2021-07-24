var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function r(e){e.forEach(t)}function o(e){return"function"==typeof e}function l(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}let s,a=!1;function c(e,t,n,r){for(;e<t;){const o=e+(t-e>>1);n(o)<=r?e=o+1:t=o}return e}function i(e,t){a?(!function(e){if(e.hydrate_init)return;e.hydrate_init=!0;const t=e.childNodes,n=new Int32Array(t.length+1),r=new Int32Array(t.length);n[0]=-1;let o=0;for(let e=0;e<t.length;e++){const l=c(1,o+1,(e=>t[n[e]].claim_order),t[e].claim_order)-1;r[e]=n[l]+1;const s=l+1;n[s]=e,o=Math.max(s,o)}const l=[],s=[];let a=t.length-1;for(let e=n[o]+1;0!=e;e=r[e-1]){for(l.push(t[e-1]);a>=e;a--)s.push(t[a]);a--}for(;a>=0;a--)s.push(t[a]);l.reverse(),s.sort(((e,t)=>e.claim_order-t.claim_order));for(let t=0,n=0;t<s.length;t++){for(;n<l.length&&s[t].claim_order>=l[n].claim_order;)n++;const r=n<l.length?l[n]:null;e.insertBefore(s[t],r)}}(e),(void 0===e.actual_end_child||null!==e.actual_end_child&&e.actual_end_child.parentElement!==e)&&(e.actual_end_child=e.firstChild),t!==e.actual_end_child?e.insertBefore(t,e.actual_end_child):e.actual_end_child=t.nextSibling):t.parentNode!==e&&e.appendChild(t)}function u(e,t,n){a&&!n?i(e,t):(t.parentNode!==e||n&&t.nextSibling!==n)&&e.insertBefore(t,n||null)}function d(e){e.parentNode.removeChild(e)}function f(e){return document.createElement(e)}function p(e){return document.createTextNode(e)}function h(){return p(" ")}function m(e,t,n,r){return e.addEventListener(t,n,r),()=>e.removeEventListener(t,n,r)}function y(e){return function(t){return t.preventDefault(),e.call(this,t)}}function g(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function v(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function b(e){s=e}function w(){if(!s)throw new Error("Function called outside component initialization");return s}const $=[],_=[],k=[],x=[],A=Promise.resolve();let j=!1;function C(e){k.push(e)}let E=!1;const z=new Set;function L(){if(!E){E=!0;do{for(let e=0;e<$.length;e+=1){const t=$[e];b(t),N(t.$$)}for(b(null),$.length=0;_.length;)_.pop()();for(let e=0;e<k.length;e+=1){const t=k[e];z.has(t)||(z.add(t),t())}k.length=0}while($.length);for(;x.length;)x.pop()();j=!1,E=!1,z.clear()}}function N(e){if(null!==e.fragment){e.update(),r(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(C)}}const F=new Set;let I;function S(e,t){e&&e.i&&(F.delete(e),e.i(t))}function T(e,t,n,r){if(e&&e.o){if(F.has(e))return;F.add(e),I.c.push((()=>{F.delete(e),r&&(n&&e.d(1),r())})),e.o(t)}}function U(e,t){const n=t.token={};function o(e,o,l,s){if(t.token!==n)return;t.resolved=s;let a=t.ctx;void 0!==l&&(a=a.slice(),a[l]=s);const c=e&&(t.current=e)(a);let i=!1;t.block&&(t.blocks?t.blocks.forEach(((e,n)=>{n!==o&&e&&(I={r:0,c:[],p:I},T(e,1,1,(()=>{t.blocks[n]===e&&(t.blocks[n]=null)})),I.r||r(I.c),I=I.p)})):t.block.d(1),c.c(),S(c,1),c.m(t.mount(),t.anchor),i=!0),t.block=c,t.blocks&&(t.blocks[o]=c),i&&L()}if((l=e)&&"object"==typeof l&&"function"==typeof l.then){const n=w();if(e.then((e=>{b(n),o(t.then,1,t.value,e),b(null)}),(e=>{if(b(n),o(t.catch,2,t.error,e),b(null),!t.hasCatch)throw e})),t.current!==t.pending)return o(t.pending,0),!0}else{if(t.current!==t.then)return o(t.then,1,t.value,e),!0;t.resolved=e}var l}function H(e,n,l,s){const{fragment:a,on_mount:c,on_destroy:i,after_update:u}=e.$$;a&&a.m(n,l),s||C((()=>{const n=c.map(t).filter(o);i?i.push(...n):r(n),e.$$.on_mount=[]})),u.forEach(C)}function M(e,t){const n=e.$$;null!==n.fragment&&(r(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function O(e,t){-1===e.$$.dirty[0]&&($.push(e),j||(j=!0,A.then(L)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function B(t,o,l,c,i,u,f=[-1]){const p=s;b(t);const h=t.$$={fragment:null,ctx:null,props:u,update:e,not_equal:i,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(p?p.$$.context:o.context||[]),callbacks:n(),dirty:f,skip_bound:!1};let m=!1;if(h.ctx=l?l(t,o.props||{},((e,n,...r)=>{const o=r.length?r[0]:n;return h.ctx&&i(h.ctx[e],h.ctx[e]=o)&&(!h.skip_bound&&h.bound[e]&&h.bound[e](o),m&&O(t,e)),n})):[],h.update(),m=!0,r(h.before_update),h.fragment=!!c&&c(h.ctx),o.target){if(o.hydrate){a=!0;const e=function(e){return Array.from(e.childNodes)}(o.target);h.fragment&&h.fragment.l(e),e.forEach(d)}else h.fragment&&h.fragment.c();o.intro&&S(t.$$.fragment),H(t,o.target,o.anchor,o.customElement),a=!1,L()}b(p)}class P{$destroy(){M(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function q(t){let n,r,o,l,s,a,c,m,y,b,w,$,_,k,x,A,j,C,E,z,L,N,F,I,S,T,U,H,M,O,B,P,q,G,R,D,X,K,V,Y=t[0].displayName+"",J=t[0]?.guild?.tag?.text?`[${t[0].guild.tag.text}]`:"",Q=t[0].level+"",W=t[0].karma+"",Z=t[0].friends+"",ee=(t[0]?.lastGame?.replace(/_/," ")??"Hidden")+"";return{c(){n=f("div"),r=f("div"),o=f("div"),l=f("img"),a=h(),c=f("p"),m=p(Y),y=h(),b=f("p"),w=p(J),$=h(),_=f("hr"),x=h(),A=f("div"),j=f("span"),C=f("p"),C.textContent="Level:",E=h(),z=f("p"),L=p(Q),N=h(),F=f("span"),I=f("p"),I.textContent="Karma:",S=h(),T=f("p"),U=p(W),H=h(),M=f("span"),O=f("p"),O.textContent="Friends:",B=h(),P=f("p"),q=p(Z),G=h(),R=f("span"),D=f("p"),D.textContent="Last Game:",X=h(),K=f("p"),V=p(ee),l.src!==(s="https://crafatar.com/avatars/"+t[0].uuid+"?overlay")&&g(l,"src",s),g(l,"class","head svelte-21y1wy"),g(l,"alt","head"),g(c,"class","username svelte-21y1wy"),g(c,"style",t[1]),g(b,"class","guild svelte-21y1wy"),g(b,"style",t[1]),g(o,"class","top svelte-21y1wy"),g(_,"class",k="divider "+("I_Like_Cats__"==t[0].displayName?"dev":"default")+" svelte-21y1wy"),g(_,"style",t[1]),g(C,"class","type svelte-21y1wy"),g(z,"class","number svelte-21y1wy"),g(j,"class","svelte-21y1wy"),g(I,"class","type svelte-21y1wy"),g(T,"class","number karma svelte-21y1wy"),g(F,"class","svelte-21y1wy"),g(O,"class","type svelte-21y1wy"),g(P,"class","number svelte-21y1wy"),g(M,"class","svelte-21y1wy"),g(D,"class","type svelte-21y1wy"),g(K,"class","number svelte-21y1wy"),g(R,"class","svelte-21y1wy"),g(A,"class","stats svelte-21y1wy"),g(r,"class","card svelte-21y1wy"),g(n,"class","wrapper svelte-21y1wy")},m(e,t){u(e,n,t),i(n,r),i(r,o),i(o,l),i(o,a),i(o,c),i(c,m),i(o,y),i(o,b),i(b,w),i(r,$),i(r,_),i(r,x),i(r,A),i(A,j),i(j,C),i(j,E),i(j,z),i(z,L),i(A,N),i(A,F),i(F,I),i(F,S),i(F,T),i(T,U),i(A,H),i(A,M),i(M,O),i(M,B),i(M,P),i(P,q),i(A,G),i(A,R),i(R,D),i(R,X),i(R,K),i(K,V)},p(e,[t]){1&t&&l.src!==(s="https://crafatar.com/avatars/"+e[0].uuid+"?overlay")&&g(l,"src",s),1&t&&Y!==(Y=e[0].displayName+"")&&v(m,Y),2&t&&g(c,"style",e[1]),1&t&&J!==(J=e[0]?.guild?.tag?.text?`[${e[0].guild.tag.text}]`:"")&&v(w,J),2&t&&g(b,"style",e[1]),1&t&&k!==(k="divider "+("I_Like_Cats__"==e[0].displayName?"dev":"default")+" svelte-21y1wy")&&g(_,"class",k),2&t&&g(_,"style",e[1]),1&t&&Q!==(Q=e[0].level+"")&&v(L,Q),1&t&&W!==(W=e[0].karma+"")&&v(U,W),1&t&&Z!==(Z=e[0].friends+"")&&v(q,Z),1&t&&ee!==(ee=(e[0]?.lastGame?.replace(/_/," ")??"Hidden")+"")&&v(V,ee)},i:e,o:e,d(e){e&&d(n)}}}function G(e){return"YOUTUBER"==e?.rank?.type?"#FF5555":e?.rank?.plus?.hex?e.rank.plus.hex:"VIP+"==e?.rank?.type?"#FFAA00":"#AAAAAA"}function R(e,t,n){let r,{player:o}=t,l={rankColour:o?.rank?.rankColour,plusColour:G(o),guildColour:o?.guild?.tag?.hex,nameFontSize:o?.guild?.tag?"24px":"36px",nameMarginTop:o?.guild?.tag?"0px":"20px"};return e.$$set=e=>{"player"in e&&n(0,o=e.player)},n(1,r=Object.entries(l).map((([e,t])=>`--${e}:${t}`)).join(";")),[o,r]}class D extends P{constructor(e){super(),B(this,e,R,q,l,{player:0})}}function X(t){let n,r,o,l,s,a,c,b,w=t[5]+"";return{c(){n=f("h1"),n.textContent="404: Something went wrong :(",r=h(),o=f("p"),l=p(w),s=h(),a=f("form"),a.innerHTML='<input id="username" name="username" value="" placeholder="Username" required="" class="svelte-j2bz15"/>',g(n,"class","svelte-j2bz15"),g(o,"class","svelte-j2bz15"),g(a,"class","svelte-j2bz15")},m(e,t){u(e,n,t),u(e,r,t),u(e,o,t),i(o,l),u(e,s,t),u(e,a,t),c||(b=m(a,"submit",y(J)),c=!0)},p(e,t){1&t&&w!==(w=e[5]+"")&&v(l,w)},i:e,o:e,d(e){e&&d(n),e&&d(r),e&&d(o),e&&d(s),e&&d(a),c=!1,b()}}}function K(e){let t,n,r,o,l,s;return r=new D({props:{player:e[0]}}),{c(){var e;t=f("form"),t.innerHTML='<input id="username" name="username" value="" placeholder="Username" required="" class="svelte-j2bz15"/>',n=h(),(e=r.$$.fragment)&&e.c(),g(t,"class","svelte-j2bz15")},m(e,a){u(e,t,a),u(e,n,a),H(r,e,a),o=!0,l||(s=m(t,"submit",y(J)),l=!0)},p(e,t){const n={};1&t&&(n.player=e[0]),r.$set(n)},i(e){o||(S(r.$$.fragment,e),o=!0)},o(e){T(r.$$.fragment,e),o=!1},d(e){e&&d(t),e&&d(n),M(r,e),l=!1,s()}}}function V(t){let n,r,o,l;return{c(){n=f("img"),o=h(),l=f("h1"),l.textContent="Fetching player data...",n.src!==(r="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif")&&g(n,"src","https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif"),g(n,"alt","Loading"),g(n,"class","svelte-j2bz15"),g(l,"class","svelte-j2bz15")},m(e,t){u(e,n,t),u(e,o,t),u(e,l,t)},p:e,i:e,o:e,d(e){e&&d(n),e&&d(o),e&&d(l)}}}function Y(e){let t,n,r,o,l,s={ctx:e,current:null,token:null,hasCatch:!0,pending:V,then:K,catch:X,value:0,error:5,blocks:[,,,]};return U(o=e[0],s),{c(){t=f("link"),n=h(),r=f("main"),s.block.c(),document.title="HyAPI",g(t,"rel","icon"),g(t,"type","image/png"),g(t,"href","../Assets/Logo.png"),g(t,"class","svelte-j2bz15"),g(r,"class","svelte-j2bz15")},m(e,o){i(document.head,t),u(e,n,o),u(e,r,o),s.block.m(r,s.anchor=null),s.mount=()=>r,s.anchor=null,l=!0},p(t,[n]){e=t,s.ctx=e,1&n&&o!==(o=e[0])&&U(o,s)||function(e,t,n){const r=t.slice(),{resolved:o}=e;e.current===e.then&&(r[e.value]=o),e.current===e.catch&&(r[e.error]=o),e.block.p(r,n)}(s,e,n)},i(e){l||(S(s.block),l=!0)},o(e){for(let e=0;e<3;e+=1){T(s.blocks[e])}l=!1},d(e){d(t),e&&d(n),e&&d(r),s.block.d(),s.token=null,s=null}}}function J(e){console.log(window.location),window.location=window.location.origin+`?name=${function(e){const t=new FormData(e.target),n={};for(let e of t){const[t,r]=e;n[t]=r}return n.username}(e)}`}function Q(e,t,n){const r=new URL("https://hyapi.tech/api/");let o=async function(e){const t=await fetch(`${r}player?name=${e}&key=temp-frontend&options=friends+guild`);if(!t.ok){const e=await t.json();throw new Error(e.error)}const l=await t.json();return n(0,o=l),l}(new URLSearchParams(window.location.search).get("name")||"de_grote");return[o]}return new class extends P{constructor(e){super(),B(this,e,Q,Y,l,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map

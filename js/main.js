/* Atlanta Ceramic — premium interactions (GSAP 3 + ScrollTrigger + Lenis, all local files)
   Rule: nothing is hidden by CSS. Start states are set here, only when the libraries loaded
   and the visitor has not asked for reduced motion. */
(function(){
"use strict";
var root=document.documentElement;
var $=function(s,c){return (c||document).querySelector(s)}, $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var hasGsap=typeof window.gsap!=="undefined"&&typeof window.ScrollTrigger!=="undefined";
var fine=window.matchMedia("(hover: hover) and (pointer: fine)").matches;
var nav=$(".nav"), burger=$(".burger"), pre=$(".preloader"), grid=$("#productGrid"), lenis=null;

/* ---------- NAV (always) ---------- */
function setMenu(o){nav.classList.toggle("open",o);burger.setAttribute("aria-expanded",o);burger.setAttribute("aria-label",o?"Close menu":"Open menu");document.body.style.overflow=o?"hidden":"";if(lenis){o?lenis.stop():lenis.start();}}
burger.addEventListener("click",function(){setMenu(!nav.classList.contains("open"))});
$$(".nav-links a").forEach(function(a){a.addEventListener("click",function(){if(nav.classList.contains("open"))setMenu(false)})});
document.addEventListener("keydown",function(e){if(e.key==="Escape"){if(nav.classList.contains("open"))setMenu(false);closeLb();}});
var lastY=window.scrollY, bar=$(".progress i");
function onScroll(){var y=window.scrollY,h=root.scrollHeight-innerHeight;
 nav.classList.toggle("scrolled",y>30);
 if(!nav.classList.contains("open"))nav.classList.toggle("hide",y>innerHeight*.7&&y>lastY+2);
 if(y<lastY-2)nav.classList.remove("hide");
 lastY=y;bar.style.transform="scaleX("+(h>0?Math.min(1,y/h):0)+")";}
window.addEventListener("scroll",onScroll,{passive:true});onScroll();
$(".to-top").addEventListener("click",function(){if(lenis)lenis.scrollTo(0,{duration:1.6});else window.scrollTo({top:0,behavior:reduce?"auto":"smooth"})});

/* ---------- LIGHTBOX (always) ---------- */
var lb=$(".lb"), lbImg=$(".lb img"), lbCap=$(".lb figcaption"), lastFocus=null;
function openLb(card){var im=$("img",card);lbImg.src=im.getAttribute("src");lbImg.alt=im.alt;
 lbCap.innerHTML="";lbCap.appendChild(document.createTextNode($("h3",card).textContent));var s=document.createElement("small");s.textContent=$("p",card).textContent;lbCap.appendChild(s);
 lastFocus=document.activeElement;lb.classList.add("open");document.body.style.overflow="hidden";if(lenis)lenis.stop();$(".lb-close").focus();
 if(hasGsap&&!reduce){gsap.fromTo(lb,{opacity:0},{opacity:1,duration:.4});gsap.fromTo(lb.querySelector("figure"),{y:40,scale:.94,opacity:0},{y:0,scale:1,opacity:1,duration:.8,ease:"expo.out"});}}
function closeLb(){if(!lb.classList.contains("open"))return;lb.classList.remove("open");document.body.style.overflow="";if(lenis)lenis.start();if(lastFocus)lastFocus.focus();}
grid.addEventListener("click",function(e){var c=e.target.closest(".card");if(c)openLb(c)});
lb.addEventListener("click",function(e){if(e.target===lb||e.target.closest(".lb-close"))closeLb()});
function makeCardsFocusable(){$$(".card",grid).forEach(function(c){c.tabIndex=0;c.setAttribute("role","button");c.setAttribute("aria-label","Preview "+$("h3",c).textContent);
 c.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();openLb(c)}})})}
makeCardsFocusable();document.addEventListener("ac:rendered",makeCardsFocusable);

/* ---------- SPOTLIGHT on why-cards (cheap CSS vars) ---------- */
$$(".why-item").forEach(function(el){el.addEventListener("pointermove",function(e){var r=el.getBoundingClientRect();el.style.setProperty("--mx",(e.clientX-r.left)+"px");el.style.setProperty("--my",(e.clientY-r.top)+"px")})});

/* ---------- TAB PILL ---------- */
var filters=$(".filters"), pill=document.createElement("span");pill.className="tab-pill";pill.setAttribute("aria-hidden","true");filters.insertBefore(pill,filters.firstChild);filters.classList.add("has-pill");
function placePill(animate){var a=$(".filter-btn.active",filters);if(!a)return;var p={x:a.offsetLeft,y:a.offsetTop,width:a.offsetWidth,height:a.offsetHeight};
 if(animate&&hasGsap&&!reduce)gsap.to(pill,{x:p.x,y:p.y,width:p.width,height:p.height,duration:.7,ease:"expo.out"});
 else if(hasGsap)gsap.set(pill,{x:p.x,y:p.y,width:p.width,height:p.height});
 else{pill.style.transform="translate("+p.x+"px,"+p.y+"px)";pill.style.width=p.width+"px";pill.style.height=p.height+"px";}}
placePill(false);window.addEventListener("resize",function(){placePill(false)});
document.addEventListener("ac:tab",function(){placePill(true)});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){placePill(false)});

/* ---------- NO-ANIMATION FALLBACK ---------- */
if(reduce||!hasGsap){if(pre&&pre.parentNode)pre.parentNode.removeChild(pre);root.classList.add("nofx");window.__acReady=true;return;}

gsap.registerPlugin(ScrollTrigger);
gsap.config({nullTargetWarn:false});

/* ---------- LENIS smooth scroll ---------- */
if(typeof window.Lenis!=="undefined"){
 lenis=new Lenis({lerp:.09,wheelMultiplier:1,smoothWheel:true});
 lenis.on("scroll",ScrollTrigger.update);
 gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0);
}
$$('a[href^="#"]').forEach(function(a){a.addEventListener("click",function(e){var id=a.getAttribute("href");if(id.length<2)return;var t=document.querySelector(id);if(!t)return;e.preventDefault();
 if(lenis)lenis.scrollTo(t,{offset:id==="#top"?0:-60,duration:1.5});else t.scrollIntoView({behavior:"smooth"});});});

/* ---------- TEXT SPLITTING ---------- */
function splitWords(el){Array.prototype.slice.call(el.childNodes).forEach(function(n){
 if(n.nodeType===3){var parts=n.textContent.split(/(\s+)/),f=document.createDocumentFragment();
  parts.forEach(function(p){if(!p)return;if(/^\s+$/.test(p)){f.appendChild(document.createTextNode(" "));return;}
   var w=document.createElement("span");w.className="w";var i=document.createElement("span");i.textContent=p;w.appendChild(i);f.appendChild(w);});
  n.parentNode.replaceChild(f,n);}
 else if(n.nodeType===1)splitWords(n);});}
$$(".split").forEach(splitWords);
function splitLit(el){var t=el.textContent.trim().split(/\s+/);el.setAttribute("aria-label",el.textContent.trim());el.innerHTML="";
 t.forEach(function(w,i){var s=document.createElement("span");s.className="wd";s.setAttribute("aria-hidden","true");s.textContent=w;el.appendChild(s);if(i<t.length-1)el.appendChild(document.createTextNode(" "));});}
$$("p.lit").forEach(splitLit);
var plWord=$(".pl-word");if(plWord){var txt=plWord.textContent;plWord.innerHTML="";txt.split("").forEach(function(ch){var s=document.createElement("span");s.innerHTML=ch===" "||ch==="\u00a0"?"&nbsp;":ch;plWord.appendChild(s)})}

/* ---------- HERO start states (hidden behind the preloader) ---------- */
gsap.set(".hero-title .ln>span",{yPercent:110});
gsap.set(".r-hero",{opacity:0,y:30});
gsap.set(".hv",{clipPath:"inset(100% 0% 0% 0% round 18px)"});
gsap.set(".hv img",{scale:1.45});
gsap.set(".hero-badge",{scale:0,rotation:-90});
gsap.set(".nav",{yPercent:-100});

function heroIntro(){
 var tl=gsap.timeline({defaults:{ease:"expo.out"}});
 tl.to(".nav",{yPercent:0,duration:1.2,clearProps:"transform"},0)
   .to(".hero-title .ln>span",{yPercent:0,duration:1.5,stagger:.14},.05)
   .to(".r-hero",{opacity:1,y:0,duration:1.3,stagger:.1,clearProps:"opacity,transform"},.35)
   .to(".hv",{clipPath:"inset(0% 0% 0% 0% round 18px)",duration:1.6,stagger:.15,ease:"power4.inOut"},.1)
   .to(".hv img",{scale:1.12,duration:2.2,stagger:.15},.2)
   .to(".hero-badge",{scale:1,rotation:0,duration:1.4},.9);
 return tl;}

/* ---------- PRELOADER ---------- */
if(pre){
 pre.style.animation="none";
 var cnt=$(".pl-count",pre),o={v:0};
 var ptl=gsap.timeline({onComplete:function(){if(pre.parentNode)pre.parentNode.removeChild(pre);}});
 ptl.from(".pl-word span",{yPercent:110,opacity:0,duration:.9,stagger:.035,ease:"expo.out"},0)
    .from(".pl-sub",{opacity:0,y:10,duration:.8,ease:"power3.out"},.35)
    .to(".pl-bar i",{scaleX:1,duration:1.25,ease:"power2.inOut"},.2)
    .to(o,{v:100,duration:1.25,ease:"power2.inOut",onUpdate:function(){cnt.textContent=Math.round(o.v)}},.2)
    .to(".pl-word span",{yPercent:-110,opacity:0,duration:.6,stagger:.02,ease:"expo.in"},1.5)
    .to([".pl-sub",".pl-bar",".pl-count"],{opacity:0,duration:.4},1.5)
    .to(pre,{clipPath:"inset(0% 0% 100% 0%)",duration:1.1,ease:"expo.inOut"},1.85)
    .add(heroIntro(),2.15);
 setTimeout(function(){if(pre.parentNode){ptl.progress(1);}},6000); /* hard safety */
}else{heroIntro();}

/* ---------- HERO scroll parallax ---------- */
gsap.timeline({scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}})
 .to(".hero-copy",{y:-110,ease:"none"},0)
 .to(".hv1",{yPercent:-14,ease:"none"},0)
 .to(".hv2",{yPercent:-40,ease:"none"},0)
 .to(".hv3",{yPercent:-70,ease:"none"},0)
 .to(".glow.g1",{yPercent:30,scale:1.25,ease:"none"},0)
 .to(".hero-lines",{opacity:0,ease:"none"},0);

/* mouse depth parallax on the hero collage (desktop) */
if(fine){var hvs=$$(".hv"),depth=[18,34,-26],qx=hvs.map(function(h){return gsap.quickTo(h,"x",{duration:1.2,ease:"power3"})}),qy=hvs.map(function(h){return gsap.quickTo(h,"y",{duration:1.2,ease:"power3"})});
 $(".hero").addEventListener("pointermove",function(e){var nx=e.clientX/innerWidth-.5,ny=e.clientY/innerHeight-.5;hvs.forEach(function(h,i){qx[i](nx*depth[i]);qy[i](ny*depth[i])});});}

/* ---------- MARQUEE: velocity-reactive ---------- */
var mq=$(".mq-track");
if(mq){mq.classList.add("gs");var loop=gsap.to(mq,{xPercent:-50,duration:34,ease:"none",repeat:-1}),skew=gsap.quickTo(mq,"skewX",{duration:.5,ease:"power3"});
 ScrollTrigger.create({trigger:".marquee",start:"top bottom",end:"bottom top",onUpdate:function(s){var v=s.getVelocity();
  gsap.to(loop,{timeScale:(s.direction<0?-1:1)*(1+Math.min(Math.abs(v)/250,5)),duration:.3,overwrite:true,onComplete:function(){gsap.to(loop,{timeScale:s.direction<0?-1:1,duration:1.2})}});
  skew(gsap.utils.clamp(-8,8,v/-300));}});
 ScrollTrigger.addEventListener("scrollEnd",function(){skew(0)});}

/* ---------- SPLIT TITLE REVEALS ---------- */
$$(".split").forEach(function(el){gsap.from($$(".w>span",el),{yPercent:110,duration:1.3,stagger:.07,ease:"expo.out",scrollTrigger:{trigger:el,start:"top 88%",once:true}})});

/* ---------- GENERIC REVEALS ---------- */
gsap.set(".reveal",{opacity:0,y:40});
ScrollTrigger.batch(".reveal",{start:"top 92%",once:true,onEnter:function(b){gsap.to(b,{opacity:1,y:0,duration:1.2,stagger:.1,ease:"expo.out",overwrite:true,clearProps:"opacity,transform"})}});
$$(".stagger").forEach(function(g){gsap.from(g.children,{opacity:0,y:50,duration:1.1,stagger:.09,ease:"expo.out",clearProps:"opacity,transform",scrollTrigger:{trigger:g,start:"top 90%",once:true}})});

/* ---------- ABOUT: scroll-lit words ---------- */
$$("p.lit").forEach(function(p){gsap.fromTo($$(".wd",p),{opacity:.16},{opacity:1,stagger:.1,ease:"none",scrollTrigger:{trigger:p,start:"top 85%",end:"bottom 50%",scrub:true}})});
$$(".count").forEach(function(el){var to=+el.dataset.to,o={v:0};el.textContent="0";ScrollTrigger.create({trigger:el,start:"top 92%",once:true,onEnter:function(){gsap.to(o,{v:to,duration:2,ease:"power3.out",onUpdate:function(){el.textContent=Math.round(o.v)}})}})});

/* ---------- RIBBON: opposite-direction scrub ---------- */
gsap.fromTo(".rb-row.r1",{x:0},{x:function(){return -innerWidth*.35},ease:"none",scrollTrigger:{trigger:".ribbon",start:"top bottom",end:"bottom top",scrub:.6,invalidateOnRefresh:true}});
gsap.fromTo(".rb-row.r2",{x:0},{x:function(){return innerWidth*.35},ease:"none",scrollTrigger:{trigger:".ribbon",start:"top bottom",end:"bottom top",scrub:.6,invalidateOnRefresh:true}});

/* ---------- FOOTER ---------- */
gsap.from(".f-copy",{opacity:0,y:20,duration:1,clearProps:"opacity,transform",scrollTrigger:{trigger:"footer",start:"top 85%",once:true}});

/* ---------- PRODUCT CARDS ---------- */
function cardsIn(cards,immediate){
 var vars={opacity:1,y:0,rotateX:0,clipPath:"inset(0% 0% 0% 0% round 20px)",duration:1.1,stagger:.08,ease:"expo.out",clearProps:"opacity,transform,clipPath"};
 gsap.set(cards,{opacity:0,y:70,rotateX:-10,clipPath:"inset(12% 0% 0% 0% round 20px)"});
 if(immediate)gsap.to(cards,vars);
 else ScrollTrigger.batch(cards,{start:"top 92%",once:true,onEnter:function(b){gsap.to(b,vars)}});
 $$(".card-media img",grid).forEach(function(im){gsap.fromTo(im,{scale:1.25},{scale:1,duration:1.6,ease:"expo.out",clearProps:"transform"})});
 bindTilt(cards);}
function bindTilt(cards){if(!fine)return;cards.forEach(function(c){
 var rx=gsap.quickTo(c,"rotationX",{duration:.6,ease:"power3"}),ry=gsap.quickTo(c,"rotationY",{duration:.6,ease:"power3"});
 c.addEventListener("pointermove",function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;rx(-y*8);ry(x*10);});
 c.addEventListener("pointerleave",function(){rx(0);ry(0)});});}
cardsIn($$(".card",grid),false);

window.acAnimatedTabs=true;var tabToken=0;
document.addEventListener("ac:tab",function(e){var size=e.detail.btn.dataset.size,my=++tabToken,old=$$(".card",grid);
 gsap.killTweensOf(old);
 gsap.to(old,{opacity:0,y:-30,scale:.97,duration:.35,stagger:.03,ease:"power2.in",onComplete:function(){if(my!==tabToken)return;window.acRender(size);}});
 if(!old.length)window.acRender(size);});
document.addEventListener("ac:rendered",function(){cardsIn($$(".card",grid),true);bindCursorTargets();ScrollTrigger.refresh();});

/* ---------- MAGNETIC BUTTONS ---------- */
if(fine){$$(".magnetic").forEach(function(m){var qx=gsap.quickTo(m,"x",{duration:.6,ease:"power3"}),qy=gsap.quickTo(m,"y",{duration:.6,ease:"power3"});
 m.addEventListener("pointermove",function(e){var r=m.getBoundingClientRect();qx((e.clientX-r.left-r.width/2)*.35);qy((e.clientY-r.top-r.height/2)*.45);});
 m.addEventListener("pointerleave",function(){gsap.to(m,{x:0,y:0,duration:1.1,ease:"elastic.out(1,.35)"})});});}

/* ---------- CUSTOM CURSOR ---------- */
var cur=$(".cursor"),dot=$(".cursor-dot");
function bindCursorTargets(){if(!fine)return;
 $$(".card,.rb-row figure").forEach(function(t){if(t.__cb)return;t.__cb=1;t.addEventListener("pointerenter",function(){cur.classList.add("big")});t.addEventListener("pointerleave",function(){cur.classList.remove("big")})});
 $$("a,button").forEach(function(t){if(t.__cb)return;t.__cb=1;t.addEventListener("pointerenter",function(){cur.classList.add("link")});t.addEventListener("pointerleave",function(){cur.classList.remove("link")})});}
if(fine){root.classList.add("has-cursor");
 var cx=gsap.quickTo(cur,"x",{duration:.5,ease:"power3"}),cy=gsap.quickTo(cur,"y",{duration:.5,ease:"power3"}),dx=gsap.quickTo(dot,"x",{duration:.08}),dy=gsap.quickTo(dot,"y",{duration:.08});
 gsap.set([cur,dot],{x:-100,y:-100});
 window.addEventListener("pointermove",function(e){cx(e.clientX);cy(e.clientY);dx(e.clientX);dy(e.clientY);},{passive:true});
 document.addEventListener("pointerleave",function(){gsap.to([cur,dot],{opacity:0,duration:.3})});
 document.addEventListener("pointerenter",function(){gsap.to([cur,dot],{opacity:1,duration:.3})});
 bindCursorTargets();}

/* ---------- ACTIVE NAV ---------- */
$$(".nav-links a").forEach(function(a){var s=document.querySelector(a.getAttribute("href"));if(!s)return;
 ScrollTrigger.create({trigger:s,start:"top 50%",end:"bottom 50%",onToggle:function(st){a.classList.toggle("on",st.isActive)}})});

window.addEventListener("load",function(){ScrollTrigger.refresh();placePill(false)});
window.__acReady=true;
})();

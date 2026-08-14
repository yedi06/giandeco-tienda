/* ==========================================================================
   GIANDECO — comportamiento
   --------------------------------------------------------------------------
   Cada bloque se registra con safe(): si uno falla, el resto del sitio sigue
   funcionando. En una maqueta que se enseña delante del cliente eso importa
   más que la elegancia del código.
   ========================================================================== */

(function(){
"use strict";

function safe(fn,nombre){
  try{ fn(); }
  catch(e){ if(window.console) console.warn("[giandeco] "+nombre+":",e); }
}

var $  = function(s,c){ return (c||document).querySelector(s); };
var $$ = function(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); };

function el(t,c,h){ var e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e; }
function src(k){ return IMG + k + ".jpg"; }

/* ---------- 1. tema ------------------------------------------------------ */

safe(function tema(){
  var raiz = document.documentElement;

  function aplicar(t){
    raiz.setAttribute("data-tema", t);
    var meta = $('meta[name="theme-color"]');
    if(meta) meta.setAttribute("content", t==="claro" ? "#FBFAF7" : "#0E0C09");
    /* El botón enseña el acabado puesto; el rótulo dice a cuál se pasa,
       que es lo único que el icono por sí solo no puede contar. */
    var destino = (t==="claro") ? "oscuro" : "claro";
    $$("[data-tema-toggle]").forEach(function(b){
      b.setAttribute("aria-label", "Acabado "+t+". Cambiar a "+destino+".");
      b.setAttribute("title", "Cambiar a acabado "+destino);
    });
  }

  document.addEventListener("click", function(e){
    var b = e.target.closest("[data-tema-toggle]");
    if(!b) return;
    aplicar(raiz.getAttribute("data-tema")==="claro" ? "oscuro" : "claro");
  });

  aplicar(raiz.getAttribute("data-tema") || "claro");
}, "tema");

/* ---------- 2. barra de progreso y aparición ----------------------------- */

safe(function progreso(){
  var barra = $("#prog");
  if(!barra) return;
  var pedido = false;
  window.addEventListener("scroll", function(){
    if(pedido) return;
    pedido = true;
    requestAnimationFrame(function(){
      var alto = document.documentElement.scrollHeight - window.innerHeight;
      barra.style.width = (alto>0 ? (window.scrollY/alto)*100 : 0) + "%";
      pedido = false;
    });
  }, {passive:true});
}, "progreso");

var observador = null;
safe(function reveal(){
  if(!("IntersectionObserver" in window)) return;
  observador = new IntersectionObserver(function(entradas){
    entradas.forEach(function(x){
      if(x.isIntersecting){ x.target.classList.add("vis"); observador.unobserve(x.target); }
    });
  }, {rootMargin:"0px 0px -8% 0px", threshold:.04});
  $$("[data-rev]").forEach(function(n){ observador.observe(n); });
  /* red de seguridad: si algo impide que el observador dispare, a los 5 s
     todo queda visible. Un sitio invisible es peor que un sitio sin animación. */
  setTimeout(function(){ $$("[data-rev]").forEach(function(n){ n.classList.add("vis"); }); }, 5000);
}, "reveal");

function observar(n){ if(observador && n){ n.setAttribute("data-rev",""); observador.observe(n); } }

/* ---------- 3. navegación entre vistas ----------------------------------- */

var VIEWS = ["home","cat","pdp","uni","proyectos","proyecto","servicios","universo",
             "espacios","esp","cuaderno","contacto"];

function show(v, arg){
  VIEWS.forEach(function(x){
    var n = document.getElementById("v-"+x);
    if(n) n.classList.toggle("on", x===v);
  });
  window.scrollTo({top:0, behavior:"auto"});
  /* La segunda fila del encabezado sigue al mundo en el que se entra.
     En la portada se queda la del catálogo, que es la que más se usa. */
  var m = mundoDeVista(v);
  pintarFila(m || "catalogo");
  $$("#mundosNav button").forEach(function(b){
    b.classList.toggle("on", !!m && b.dataset.mundo===m);
  });
  marcarFila(v, arg);
}

function crumb(node, partes){
  if(!node) return;
  node.innerHTML = "";
  partes.forEach(function(p,i){
    if(i){ node.appendChild(el("span","sep","/")); }
    if(p.go){
      var b = el("button",null,p.t); b.type="button";
      b.addEventListener("click", function(){ go(p.go); });
      node.appendChild(b);
    } else {
      node.appendChild(el("span","cur",p.t));
    }
  });
}

function go(ruta){
  var a = String(ruta).split(":"), v = a[0], arg = a[1];
  if(v==="cat"){ openCat(arg); return; }
  if(v==="pdp"){ openPdp(arg); return; }
  if(v==="uni"){ openUni(arg); return; }
  if(v==="esp"){ openEsp(arg); return; }
  if(v==="proyecto"){ openProyecto(arg); return; }
  if(v==="unicos"){ openCat("unicos"); return; }
  if(v==="proyectos"){ crumb($("#proyCrumb"),[{t:"Inicio",go:"home"},{t:"Proyectos"}]); show("proyectos","proyectos"); return; }
  if(v==="servicios"){ crumb($("#serCrumb"),[{t:"Inicio",go:"home"},{t:"Servicios"}]); show("servicios","servicios"); return; }
  if(v==="universo"){ crumb($("#uvCrumb"),[{t:"Inicio",go:"home"},{t:"El estudio"}]); show("universo","universo"); return; }
  if(v==="contacto"){ crumb($("#contCrumb"),[{t:"Inicio",go:"home"},{t:"Contacto"}]); show("contacto","contacto"); return; }
  if(v==="espacios"){ crumb($("#espCrumb"),[{t:"Inicio",go:"home"},{t:"Compra el espacio"}]); show("espacios","espacios"); return; }
  if(v==="cuaderno"){ crumb($("#cuaCrumb"),[{t:"Inicio",go:"home"},{t:"Blog"}]); show("cuaderno","cuaderno"); return; }
  show(v);
}

document.addEventListener("click", function(e){
  var b = e.target.closest("[data-go]");
  if(!b) return;
  e.preventDefault();
  cerrarMega(); cerrarMovil();
  go(b.dataset.go);
});

/* ---------- 4. tarjeta de producto --------------------------------------- */

function swatches(cs){
  var s = '<div class="sw">';
  cs.slice(0,4).forEach(function(c,i){
    s += '<i style="background:'+(COLOR[c]||"#888")+'"'+(i===0?' data-active':'')+'></i>';
  });
  if(cs.length>4) s += '<b>+'+(cs.length-4)+'</b>';
  return s + '</div>';
}

function card(p){
  var c = el("article","pc");
  var flag = p.uni ? '<span class="flag uni">Pieza única</span>'
           : (p.stock==="out" ? '<span class="flag">Bajo pedido</span>' : "");
  c.innerHTML =
    '<figure>'+flag+'<img src="'+src(p.img)+'" alt="'+p.name+' — '+p.tag+'" loading="lazy" />'+
      '<button class="quick" type="button">'+(p.uni?"Ver la pieza":"Añadir al carrito")+'</button></figure>'+
    '<div class="body">'+swatches(p.colors)+'<span class="vname">'+p.colors[0]+'</span>'+
      '<h3>'+p.name+'</h3><p class="desc">'+p.tag+'</p>'+
      '<span class="pr">'+(p.colors.length>1?'<small>Desde </small>':'')+money(p.price)+'</span></div>';
  c.addEventListener("click", function(e){
    if(e.target.closest(".quick")) return;
    go(p.uni ? ("uni:"+p.id) : ("pdp:"+p.id));
  });
  c.querySelector(".quick").addEventListener("click", function(e){
    e.stopPropagation();
    if(p.uni){ go("uni:"+p.id); return; }
    add(p.id,1); openCart(true);
  });
  return c;
}

function fill(n,l){
  if(!n) return;
  n.innerHTML = "";
  if(!l.length){ n.appendChild(el("p","empty","No hay piezas que cumplan esos filtros. Quite alguno para ver más.")); return; }
  l.forEach(function(p){ n.appendChild(card(p)); });
}

function subImg(slug,sub){
  var p = PRODUCTS.filter(function(x){ return x.cat===slug && x.sub===sub; })[0];
  if(!p) p = PRODUCTS.filter(function(x){ return x.cat===slug; })[0];
  return p ? src(p.img) : "";
}

/* ---------- 5. azulejo grande (categorías, servicios) --------------------
   Sustituye a los círculos: el rectángulo deja ver el ambiente completo
   y aguanta el tamaño que el cliente pidió.
   ------------------------------------------------------------------------ */

function tile(img, titulo, kicker, ruta){
  var b = el("button","tile"); b.type = "button";
  b.innerHTML =
    '<img src="'+src(img)+'" alt="" loading="lazy" />'+
    '<span class="veil"></span>'+
    '<span class="cap"><span>'+kicker+'</span><b>'+titulo+'</b></span>';
  b.addEventListener("click", function(){ go(ruta); });
  return b;
}

/* ---------- 6. tarjeta de proyecto --------------------------------------- */

/* La ficha va dentro de la foto: ubicación arriba en versalita, nombre
   debajo en serif, todo centrado. El detalle del encargo sólo aparece al
   pasar el puntero, para que la rejilla en reposo respire. */
function proyCard(pr){
  var b = el("button","proj");
  b.type = "button";
  b.innerHTML =
    '<img src="'+src(pr.cover)+'" alt="'+pr.t+' — '+pr.sub+'" loading="lazy" />'+
    '<span class="veil"></span>'+
    '<span class="proj-meta">'+
      '<span class="k">'+pr.lugar+'</span>'+
      '<h3>'+pr.t+'</h3>'+
      '<p class="d">'+pr.sub+'</p>'+
    '</span>';
  b.addEventListener("click", function(){ go("proyecto:"+pr.slug); });
  return b;
}

/* ---------- 7. cabecera: catálogo, mega menú y menú móvil ---------------- */

var mega = $("#mega"), megaAbierto = null;

function cerrarMega(){
  if(!mega) return;
  mega.hidden = true; megaAbierto = null;
  $$("#cats button[data-cat]").forEach(function(b){ b.setAttribute("aria-expanded","false"); });
}

function abrirMega(t, boton){
  if(!mega) return;
  if(megaAbierto === t.slug) return;
  cerrarMega();
  megaAbierto = t.slug;
  boton.setAttribute("aria-expanded","true");
  var caja = el("div","mega-in");
  t.subs.forEach(function(s){
    var muestra = PRODUCTS.filter(function(p){ return p.cat===t.slug && p.sub===s.s; })[0];
    if(!muestra) return;
    var b = el("button","mega-sub"); b.type="button";
    b.innerHTML = '<span class="ph"><img src="'+src(muestra.img)+'" alt="" loading="lazy" /></span>'+
                  '<span>'+s.name+'</span>';
    b.addEventListener("click", function(){
      cerrarMega(); openCat(t.slug);
      state.sub = s.s; renderSubs(); applyCat();
    });
    caja.appendChild(b);
  });
  var todo = el("button","mega-todo","Ver todo en "+t.name);
  todo.type = "button";
  todo.addEventListener("click", function(){ cerrarMega(); openCat(t.slug); });
  mega.innerHTML = "";
  mega.appendChild(caja);
  mega.appendChild(todo);
  mega.hidden = false;
}

/* ---------- 7 bis. los tres mundos ---------------------------------------
   La cabecera se organiza como la casa: arriba los tres mundos y debajo
   una fila que cambia según en cuál se esté. Estando en la tienda salen
   las categorías; estando en diseño de interiores, el estudio y los
   proyectos. Nada de barras separadoras: separa el aire.
   ------------------------------------------------------------------------ */

var MUNDOS = [
  {id:"catalogo",  nombre:"Catálogo",             ir:"cat:asientos",
   vistas:["cat","pdp","uni","esp","espacios"]},
  {id:"interiores",nombre:"Diseño de interiores", ir:"servicios",
   vistas:["servicios","proyectos","proyecto"]},
  {id:"universo",  nombre:"Nuestro universo",     ir:"universo",
   vistas:["universo","cuaderno","contacto"]}
];

var mundoActual = null;

function mundoDeVista(v){
  var m = MUNDOS.filter(function(x){ return x.vistas.indexOf(v)>=0; })[0];
  return m ? m.id : null;
}

safe(function navMundos(){
  var nav = $("#mundosNav");
  if(!nav) return;
  MUNDOS.forEach(function(m){
    var b = el("button",null,m.nombre); b.type="button";
    b.dataset.mundo = m.id;
    b.addEventListener("click", function(){ cerrarMega(); go(m.ir); });
    nav.appendChild(b);
  });
}, "navMundos");

/* Segunda fila: se vuelve a dibujar cada vez que se cambia de mundo. */
function pintarFila(idMundo){
  var cats = $("#cats"), buscar = $("#sBtn");
  if(!cats) return;
  if(mundoActual === idMundo) return;
  mundoActual = idMundo;
  cats.innerHTML = "";

  $$("#mundosNav button").forEach(function(b){
    b.classList.toggle("on", b.dataset.mundo === idMundo);
  });

  var finoMQ = window.matchMedia ? window.matchMedia("(hover:hover) and (pointer:fine)") : null;
  var punteroFino = function(){ return finoMQ ? finoMQ.matches : true; };

  function simple(texto, ruta){
    var b = el("button",null,texto); b.type="button";
    b.dataset.ruta = ruta;
    b.addEventListener("click", function(){ cerrarMega(); go(ruta); });
    return b;
  }

  if(idMundo === "interiores"){
    cats.appendChild(simple("El estudio","servicios"));
    cats.appendChild(simple("Proyectos","proyectos"));
    if(buscar) buscar.style.visibility = "hidden";
  } else if(idMundo === "universo"){
    cats.appendChild(simple("Nuestro universo","universo"));
    cats.appendChild(simple("Blog","cuaderno"));
    cats.appendChild(simple("Contacto","contacto"));
    if(buscar) buscar.style.visibility = "hidden";
  } else {
    TAX.forEach(function(t){
      var b = el("button",null,t.name); b.type="button";
      b.dataset.cat = t.slug; b.setAttribute("aria-expanded","false");
      /* En escritorio el panel se abre al pasar el puntero y el clic lleva
         directo a la categoría: en una tienda, el clic tiene que avanzar. */
      b.addEventListener("mouseenter", function(){ if(punteroFino()) abrirMega(t,b); });
      b.addEventListener("focus", function(){ if(punteroFino()) abrirMega(t,b); });
      b.addEventListener("click", function(e){
        e.stopPropagation();
        if(punteroFino()){ cerrarMega(); openCat(t.slug); return; }
        if(megaAbierto===t.slug){ cerrarMega(); openCat(t.slug); } else { abrirMega(t,b); }
      });
      cats.appendChild(b);
    });
    cats.appendChild(el("span","hueco"));
    cats.appendChild(simple("Piezas únicas","unicos"));
    cats.appendChild(simple("Compra el espacio","espacios"));
    if(buscar) buscar.style.visibility = "";
  }
}

/* marca la entrada activa de la segunda fila sin volver a dibujarla */
function marcarFila(v, arg){
  $$("#cats button").forEach(function(b){
    var activo = (b.dataset.cat && b.dataset.cat===arg) ||
                 (b.dataset.ruta && b.dataset.ruta===v);
    b.classList.toggle("active", !!activo);
  });
}

safe(function cierres(){
  var zona = $(".head");
  var finoMQ = window.matchMedia ? window.matchMedia("(hover:hover) and (pointer:fine)") : null;
  if(zona) zona.addEventListener("mouseleave", function(){
    if(!finoMQ || finoMQ.matches) cerrarMega();
  });
  document.addEventListener("click", function(e){
    if(mega && !mega.hidden && !e.target.closest(".mega") && !e.target.closest("#cats")) cerrarMega();
  });
  document.addEventListener("keydown", function(e){ if(e.key==="Escape") cerrarMega(); });
  pintarFila("catalogo");
}, "cierres");

var mnav = $("#mnav"), scrim = $("#scrim");

function sincronizarVelo(){
  var hay = (mnav && mnav.classList.contains("on")) ||
            ($("#drawer") && $("#drawer").classList.contains("on"));
  if(scrim) scrim.classList.toggle("on", !!hay);
  document.body.style.overflow = hay ? "hidden" : "";
}

function abrirMovil(o){
  if(!mnav) return;
  mnav.classList.toggle("on", o);
  mnav.setAttribute("aria-hidden", String(!o));
  var b = $("#burger");
  if(b) b.setAttribute("aria-expanded", String(o));
  sincronizarVelo();
}
function cerrarMovil(){ abrirMovil(false); }

safe(function menuMovil(){
  if(!mnav) return;
  var top = el("div","mnav-top",'<span>Menú</span>');
  var x = el("button","mnav-x","&times;"); x.type="button"; x.setAttribute("aria-label","Cerrar menú");
  x.addEventListener("click", cerrarMovil);
  top.appendChild(x);
  mnav.appendChild(top);

  var body = el("div","mnav-body");

  TAX.forEach(function(t){
    var acc = el("div","macc");
    var cab = el("button",null,t.name+'<span class="ar"></span>');
    cab.type="button"; cab.setAttribute("aria-expanded","false");
    var panel = el("div","mpanel");
    t.subs.forEach(function(s){
      var muestra = PRODUCTS.filter(function(p){ return p.cat===t.slug && p.sub===s.s; })[0];
      if(!muestra) return;
      var b = el("button","msub"); b.type="button";
      b.innerHTML = '<span class="ph"><img src="'+src(muestra.img)+'" alt="" loading="lazy" /></span>'+
                    '<span>'+s.name+'</span>';
      b.addEventListener("click", function(){
        cerrarMovil(); openCat(t.slug); state.sub = s.s; renderSubs(); applyCat();
      });
      panel.appendChild(b);
    });
    cab.addEventListener("click", function(){
      var abierto = panel.classList.toggle("on");
      cab.setAttribute("aria-expanded", String(abierto));
    });
    acc.appendChild(cab); acc.appendChild(panel);
    body.appendChild(acc);
  });

  [["unicos","Piezas únicas"],["espacios","Compra el espacio"],["proyectos","Proyectos"],
   ["servicios","Servicios"],["universo","El estudio"],["cuaderno","Blog"],
   ["contacto","Contacto"]].forEach(function(x){
    var b = el("button","mlink",x[1]); b.type="button";
    b.addEventListener("click", function(){ cerrarMovil(); go(x[0]); });
    body.appendChild(b);
  });

  var SOL  = '<svg class="i-sol" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/>'+
             '<path d="M12 2.4v2.6M12 19v2.6M21.6 12H19M5 12H2.4M18.8 5.2l-1.8 1.8'+
             'M7 17l-1.8 1.8M18.8 18.8 17 17M7 7 5.2 5.2"/></svg>';
  var LUNA = '<svg class="i-luna" viewBox="0 0 24 24" aria-hidden="true">'+
             '<path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1z"/></svg>';

  var tema = el("button","tema-btn",
    SOL + LUNA +
    '<span class="tlbl"><span class="lbl-claro">Pasar a acabado oscuro</span>' +
    '<span class="lbl-oscuro">Pasar a acabado claro</span></span>');
  tema.type = "button";
  tema.setAttribute("data-tema-toggle","");
  body.appendChild(tema);

  mnav.appendChild(body);

  var burger = $("#burger");
  if(burger) burger.addEventListener("click", function(){ abrirMovil(!mnav.classList.contains("on")); });
  if(scrim) scrim.addEventListener("click", function(){ cerrarMovil(); openCart(false); });
  document.addEventListener("keydown", function(e){
    if(e.key==="Escape"){ cerrarMovil(); openCart(false); }
  });
}, "menuMovil");

/* ---------- 8. portada --------------------------------------------------- */

safe(function portada(){
  var media = $("#campMedia"), dots = $("#cDots");
  if(media){
    CAMPS.forEach(function(c,i){
      var im = document.createElement("img");
      im.src = src(c.img); im.alt = c.t;
      if(i===0){ im.className = "on"; } else { im.loading = "lazy"; }
      media.appendChild(im);
    });
  }
  var idx = 0, reloj = null;

  function pintar(){
    var c = CAMPS[idx];
    if(media) $$("img",media).forEach(function(x,i){ x.classList.toggle("on", i===idx); });
    var e=$("#cEye"), t=$("#cTitle"), p=$("#cText"), cta=$("#cCta");
    if(e) e.textContent = c.eye;
    if(t) t.textContent = c.t;
    if(p) p.textContent = c.p;
    if(cta){ cta.textContent = c.cta; cta.onclick = function(){ go(c.go); }; }
    if(dots) $$("button",dots).forEach(function(b,i){ b.setAttribute("aria-current", String(i===idx)); });
  }

  if(dots){
    CAMPS.forEach(function(c,i){
      var b = document.createElement("button"); b.type="button";
      b.setAttribute("aria-label","Campaña "+(i+1)+": "+c.t);
      b.addEventListener("click", function(){ idx=i; pintar(); reiniciar(); });
      dots.appendChild(b);
    });
  }
  function reiniciar(){
    if(reloj) clearInterval(reloj);
    reloj = setInterval(function(){ idx=(idx+1)%CAMPS.length; pintar(); }, 7000);
  }
  pintar(); reiniciar();

  /* azulejos de categoría — el reemplazo de los círculos */
  var hc = $("#homeCats");
  if(hc) TAX.forEach(function(t){
    hc.appendChild(tile(t.img, t.name, "Colección", "cat:"+t.slug));
  });

  /* proyectos destacados */
  var hp = $("#homeProy");
  if(hp) PROYECTOS.slice(0,4).forEach(function(pr){
    hp.appendChild(proyCard(pr));
  });

  /* novedades */
  fill($("#homeGrid"), PRODUCTS.filter(function(p){ return !p.uni; }).slice(0,8));

  /* espacios */
  var he = $("#homeEsp");
  if(he) ESPACIOS.slice(0,3).forEach(function(e){ he.appendChild(espCard(e)); });

  /* las cinco líneas */
  var hl = $("#homeLineas");
  if(hl) LINEAS.forEach(function(l){
    hl.appendChild(tile(l.img, l.t, l.n, "servicios"));
  });

  /* blog */
  var hj = $("#homeJournal");
  if(hj) NOTAS.slice(0,3).forEach(function(n){ hj.appendChild(notaCard(n)); });
}, "portada");

/* ---------- 9. catálogo -------------------------------------------------- */

var state = {cat:null, sub:null, f:{mat:[],col:[],place:[],style:[],pri:[],avail:[]}, q:"", sort:"rel", view:"grid"};

function pool(){
  if(state.cat==="unicos") return PRODUCTS.filter(function(p){ return p.uni; });
  return PRODUCTS.filter(function(p){ return p.cat===state.cat && !p.uni; });
}
function priceOK(p){
  if(!state.f.pri.length) return true;
  return state.f.pri.some(function(r){ var a=r.split("-"); return p.price>=+a[0] && p.price<=+a[1]; });
}
function match(p){
  if(state.sub && p.sub!==state.sub) return false;
  if(state.f.mat.length && state.f.mat.indexOf(p.mat)<0) return false;
  if(state.f.place.length && state.f.place.indexOf(p.place)<0) return false;
  if(state.f.style.length && state.f.style.indexOf(p.style)<0) return false;
  if(state.f.col.length && !p.colors.some(function(c){ return state.f.col.indexOf(c)>=0; })) return false;
  if(state.f.avail.length && state.f.avail.indexOf("stock")>=0 && p.stock==="out") return false;
  return priceOK(p);
}
function uniq(l,fn){
  var o=[]; l.forEach(function(x){ var v=fn(x); if(v && o.indexOf(v)<0) o.push(v); }); return o;
}

var RANGOS = [["0-500","Hasta S/ 500"],["500-1500","S/ 500 – 1,500"],
              ["1500-3500","S/ 1,500 – 3,500"],["3500-99999","Más de S/ 3,500"]];

function buildFacets(){
  var box = $("#facets");
  if(!box) return;
  box.innerHTML = "";
  var base = pool();

  function grupo(titulo, clave, opciones, etiqueta, abierto){
    if(opciones.length<2) return;
    var d = el("details","fx");
    if(abierto) d.open = true;
    d.innerHTML = "<summary>"+titulo+"</summary>";
    var cont = el("div","fb");
    opciones.forEach(function(v){
      var lab = el("label");
      var inp = document.createElement("input");
      inp.type = "checkbox"; inp.value = v;
      inp.checked = state.f[clave].indexOf(v)>=0;
      inp.addEventListener("change", function(){
        var i = state.f[clave].indexOf(v);
        if(inp.checked){ if(i<0) state.f[clave].push(v); }
        else if(i>=0){ state.f[clave].splice(i,1); }
        applyCat();
      });
      lab.appendChild(inp);
      lab.appendChild(document.createTextNode(etiqueta?etiqueta(v):v));
      cont.appendChild(lab);
    });
    d.appendChild(cont);
    box.appendChild(d);
  }

  grupo("Material","mat", uniq(base,function(p){return p.mat;}), null, true);
  grupo("Color","col", uniq(base.reduce(function(a,p){return a.concat(p.colors);},[]),function(x){return x;}),
        function(v){ return v.charAt(0).toUpperCase()+v.slice(1); }, true);
  grupo("Ambiente","place", uniq(base,function(p){return p.place;}));
  grupo("Estilo","style", uniq(base,function(p){return p.style;}));
  grupo("Precio","pri", RANGOS.map(function(r){return r[0];}), function(v){
    var r = RANGOS.filter(function(x){return x[0]===v;})[0]; return r?r[1]:v;
  }, true);
  grupo("Disponibilidad","avail", ["stock"], function(){ return "Solo en stock"; });
}

function renderChips(){
  var box = $("#chips");
  if(!box) return;
  box.innerHTML = "";
  var todos = [];
  Object.keys(state.f).forEach(function(k){
    state.f[k].forEach(function(v){ todos.push([k,v]); });
  });
  if(state.sub){
    var t = TAX.filter(function(x){return x.slug===state.cat;})[0];
    var s = t && t.subs.filter(function(x){return x.s===state.sub;})[0];
    if(s) todos.unshift(["sub", s.name]);
  }
  if(!todos.length) return;
  todos.forEach(function(par){
    var etiqueta = par[1];
    if(par[0]==="pri"){
      var r = RANGOS.filter(function(x){return x[0]===par[1];})[0];
      if(r) etiqueta = r[1];
    }
    if(par[0]==="avail") etiqueta = "Solo en stock";
    var b = el("button",null, etiqueta+' <i>&times;</i>'); b.type="button";
    b.addEventListener("click", function(){
      if(par[0]==="sub"){ state.sub=null; renderSubs(); }
      else{
        var i = state.f[par[0]].indexOf(par[1]);
        if(i>=0) state.f[par[0]].splice(i,1);
        buildFacets();
      }
      applyCat();
    });
    box.appendChild(b);
  });
  var limpiar = el("button",null,"Quitar todos"); limpiar.type="button";
  limpiar.addEventListener("click", function(){
    state.sub = null;
    state.f = {mat:[],col:[],place:[],style:[],pri:[],avail:[]};
    buildFacets(); renderSubs(); applyCat();
  });
  box.appendChild(limpiar);
}

function renderSubs(){
  var box = $("#catSubs");
  if(!box) return;
  box.innerHTML = "";
  var t = TAX.filter(function(x){ return x.slug===state.cat; })[0];
  if(!t){ box.style.display="none"; return; }
  box.style.display = "";
  t.subs.forEach(function(s){
    var muestra = PRODUCTS.filter(function(p){ return p.cat===t.slug && p.sub===s.s; })[0];
    if(!muestra) return;
    var b = el("button","sub-c"); b.type="button";
    b.setAttribute("aria-pressed", String(state.sub===s.s));
    b.innerHTML = '<span class="ph"><img src="'+src(muestra.img)+'" alt="" loading="lazy" /></span>'+
                  '<span>'+s.name+'</span>';
    b.addEventListener("click", function(){
      state.sub = (state.sub===s.s) ? null : s.s;
      renderSubs(); applyCat();
    });
    box.appendChild(b);
  });
}

function applyCat(){
  var l = pool().filter(match);
  if(state.sort==="asc") l.sort(function(a,b){ return a.price-b.price; });
  else if(state.sort==="desc") l.sort(function(a,b){ return b.price-a.price; });
  else if(state.sort==="az") l.sort(function(a,b){ return a.name.localeCompare(b.name,"es"); });
  var g = $("#catGrid");
  if(g){
    g.className = "grid" + (state.view==="list" ? " list" : "");
    fill(g,l);
  }
  var c = $("#cnt");
  if(c) c.textContent = l.length===1 ? "1 pieza" : l.length+" piezas";
  renderChips();
}

function openCat(slug){
  state.cat = slug; state.sub = null;
  state.f = {mat:[],col:[],place:[],style:[],pri:[],avail:[]};
  var t = TAX.filter(function(x){ return x.slug===slug; })[0];
  var nombre = t ? t.name : "Piezas únicas";
  var titulo = $("#catTitle");
  if(titulo) titulo.innerHTML = nombre + '<span class="dash"></span>';
  crumb($("#catCrumb"), [{t:"Inicio",go:"home"},{t:"Tienda",go:"home"},{t:nombre}]);
  var promo = $("#catPromo");
  if(promo) promo.hidden = (slug!=="navidad");
  renderSubs(); buildFacets(); applyCat(); show("cat", slug);
}

safe(function controlesCatalogo(){
  var sort = $("#sort");
  if(sort) sort.addEventListener("change", function(e){ state.sort=e.target.value; applyCat(); });
  var vg = $("#vGrid"), vl = $("#vList");
  if(vg) vg.addEventListener("click", function(){
    state.view="grid"; vg.setAttribute("aria-pressed","true"); vl.setAttribute("aria-pressed","false"); applyCat();
  });
  if(vl) vl.addEventListener("click", function(){
    state.view="list"; vl.setAttribute("aria-pressed","true"); vg.setAttribute("aria-pressed","false"); applyCat();
  });
  var ft = $("#fToggle");
  if(ft) ft.addEventListener("click", function(){
    var f = $("#facets"), abierto = f.classList.toggle("open");
    ft.setAttribute("aria-expanded", String(abierto));
  });
}, "controlesCatalogo");

/* ---------- 10. ficha de producto ---------------------------------------- */

var pq = 1, pcur = null;

function galeria(p){
  var lista = [p.img].concat(p.gal||[]);
  var principal = $("#galMain"), thumbs = $("#galThumbs");
  if(principal){ principal.src = src(lista[0]); principal.alt = p.name+" — "+p.tag; }
  if(!thumbs) return;
  thumbs.innerHTML = "";
  if(lista.length<2) return;
  lista.forEach(function(k,i){
    var b = el("button",null,'<img src="'+src(k)+'" alt="" loading="lazy" />');
    b.type = "button";
    b.setAttribute("aria-current", String(i===0));
    b.setAttribute("aria-label","Ver imagen "+(i+1));
    b.addEventListener("click", function(){
      if(principal) principal.src = src(k);
      $$("button",thumbs).forEach(function(x,j){ x.setAttribute("aria-current", String(i===j)); });
    });
    thumbs.appendChild(b);
  });
}

function openPdp(id){
  var p = byId[id];
  if(!p) return;
  if(p.uni){ openUni(id); return; }
  pcur = p; pq = 1;
  var qv = $("#qVal"); if(qv) qv.textContent = "1";

  galeria(p);

  var t = TAX.filter(function(x){ return x.slug===p.cat; })[0];
  var sub = t && t.subs.filter(function(x){ return x.s===p.sub; })[0];
  crumb($("#pdpCrumb"), [{t:"Inicio",go:"home"},{t:t?t.name:"Tienda",go:"cat:"+p.cat},{t:p.name}]);

  var set = function(sel,val){ var n=$(sel); if(n) n.textContent = val; };
  set("#pdpEye", sub ? sub.name : (t?t.name:""));
  set("#pdpName", p.name);
  set("#pdpTag", p.tag);
  set("#pdpPrice", money(p.price));
  set("#acDesc", p.desc);
  set("#acMat", p.matx);
  set("#acCare", p.care);
  set("#acLead", p.lead);

  var st = $("#pdpStock");
  if(st){
    st.className = "stock" + (p.stock==="low" ? " low" : "");
    st.textContent = p.stock==="out" ? "Bajo pedido · "+p.lead
                   : p.stock==="low" ? "Últimas unidades"
                   : "En stock · entrega en "+p.lead;
  }

  var vars = $("#pdpVars");
  if(vars){
    vars.innerHTML = '<span class="lbl">Acabado</span>';
    var opts = el("div","opts");
    p.colors.forEach(function(c,i){
      var b = document.createElement("button");
      b.type = "button";
      b.style.background = COLOR[c] || "#888";
      b.setAttribute("aria-pressed", String(i===0));
      b.setAttribute("aria-label", c);
      b.addEventListener("click", function(){
        $$("button",opts).forEach(function(x){ x.setAttribute("aria-pressed","false"); });
        b.setAttribute("aria-pressed","true");
      });
      opts.appendChild(b);
    });
    vars.appendChild(opts);
  }

  var dim = $("#acDim");
  if(dim){
    dim.innerHTML = "";
    p.dims.forEach(function(d){ dim.appendChild(el("tr",null,"<td>"+d[0]+"</td><td>"+d[1]+"</td>")); });
  }

  var rel = PRODUCTS.filter(function(x){
    return x.id!==p.id && !x.uni && (x.cat===p.cat || x.place===p.place);
  }).slice(0,4);
  fill($("#pdpRel"), rel);

  show("pdp");
}

safe(function controlesPdp(){
  var mas = $("#qPlus"), menos = $("#qMinus"), val = $("#qVal");
  if(mas) mas.addEventListener("click", function(){ pq++; val.textContent = pq; });
  if(menos) menos.addEventListener("click", function(){ if(pq>1){ pq--; val.textContent = pq; } });
  var addBtn = $("#pdpAdd");
  if(addBtn) addBtn.addEventListener("click", function(){
    if(!pcur) return;
    add(pcur.id, pq); openCart(true);
  });
}, "controlesPdp");

/* ---------- 11. pieza única ---------------------------------------------- */

var ucur = null;

function openUni(id){
  var p = byId[id];
  if(!p) return;
  ucur = p;
  var set = function(sel,val,attr){
    var n = $(sel); if(!n) return;
    if(attr) n.setAttribute(attr,val); else n.textContent = val;
  };
  set("#uniBg", src(p.img), "src");
  set("#uniImg", src((p.gal&&p.gal[0]) || p.img), "src");
  set("#uniName", p.name);
  set("#uniTag", p.tag);
  set("#uniPrice", money(p.price));
  set("#uniStory", p.story);
  set("#uniProv", p.prov);
  crumb($("#uniCrumb"), [{t:"Inicio",go:"home"},{t:"Piezas únicas",go:"unicos"},{t:p.name}]);
  var dim = $("#uniDim");
  if(dim){
    dim.innerHTML = "";
    p.dims.forEach(function(d){ dim.appendChild(el("tr",null,"<td>"+d[0]+"</td><td>"+d[1]+"</td>")); });
    dim.appendChild(el("tr",null,"<td>Materiales</td><td>"+p.matx+"</td>"));
  }
  show("uni");
}

safe(function controlesUni(){
  var b = $("#uniAdd");
  if(b) b.addEventListener("click", function(){ if(ucur){ add(ucur.id,1); openCart(true); } });
}, "controlesUni");

/* ---------- 12. proyectos ------------------------------------------------ */

var filtroProy = "todos";

function renderProyectos(){
  var g = $("#proyGrid");
  if(!g) return;
  g.innerHTML = "";
  var lista = (filtroProy==="todos")
    ? PROYECTOS
    : PROYECTOS.filter(function(p){ return p.linea===filtroProy; });
  lista.forEach(function(pr){ g.appendChild(proyCard(pr)); });
  if(!lista.length) g.appendChild(el("p","empty","No hay proyectos en esta línea todavía."));
}

safe(function proyectos(){
  var f = $("#proyFiltros");
  if(f){
    ["todos"].concat(LINEAS_PR).forEach(function(l){
      var b = el("button",null, l==="todos" ? "Todos" : l);
      b.type = "button";
      b.setAttribute("aria-pressed", String(l===filtroProy));
      b.addEventListener("click", function(){
        filtroProy = l;
        $$("button",f).forEach(function(x){ x.setAttribute("aria-pressed","false"); });
        b.setAttribute("aria-pressed","true");
        renderProyectos();
      });
      f.appendChild(b);
    });
  }
  renderProyectos();
}, "proyectos");

function openProyecto(slug){
  var i = -1;
  PROYECTOS.forEach(function(p,j){ if(p.slug===slug) i=j; });
  if(i<0) return;
  var pr = PROYECTOS[i];

  var set = function(sel,val,attr){
    var n = $(sel); if(!n) return;
    if(attr) n.setAttribute(attr,val); else n.textContent = val;
  };
  set("#prBg", src(pr.cover), "src");
  set("#prBg", pr.t, "alt");
  set("#prLinea", pr.linea);
  set("#prTitle", pr.t);
  set("#prSub", pr.sub + " · " + pr.lugar + " · " + pr.anio);
  crumb($("#prCrumb"), [{t:"Inicio",go:"home"},{t:"Proyectos",go:"proyectos"},{t:pr.t}]);

  set("#prReto", pr.reto || "");
  set("#prInspira", pr.inspira || "");
  set("#prCita", pr.cita || "");
  var cita = $(".pr-cita");
  if(cita) cita.hidden = !pr.cita;

  var txt = $("#prTexto");
  if(txt){
    txt.innerHTML = "";
    pr.txt.forEach(function(p){ txt.appendChild(el("p",null,p)); });
  }

  var mats = $("#prMats");
  if(mats){
    mats.innerHTML = "";
    if(pr.mats && pr.mats.length){
      mats.appendChild(el("span","mats-t","Materiales y acabados"));
      var ul = el("ul");
      pr.mats.forEach(function(m){ ul.appendChild(el("li",null,m)); });
      mats.appendChild(ul);
    }
  }

  var dat = $("#prDatos");
  if(dat){
    dat.innerHTML = "";
    pr.datos.forEach(function(d){
      dat.appendChild(el("div",null,"<dt>"+d[0]+"</dt><dd>"+d[1]+"</dd>"));
    });
  }

  var gal = $("#prGal");
  if(gal){
    gal.innerHTML = "";
    pr.gal.forEach(function(k){
      gal.appendChild(el("figure",null,'<img src="'+src(k)+'" alt="'+pr.t+'" loading="lazy" />'));
    });
  }

  var sig = PROYECTOS[(i+1) % PROYECTOS.length];
  var nn = $("#prNextName");
  if(nn) nn.textContent = sig.t + " — " + sig.sub;
  var bn = $("#prNext");
  if(bn) bn.onclick = function(){ openProyecto(sig.slug); };

  show("proyecto");
}

/* ---------- 13. servicios ------------------------------------------------ */

safe(function servicios(){
  var box = $("#serLineas");
  if(!box) return;
  LINEAS.forEach(function(l){
    var a = el("article","linea");
    a.innerHTML =
      '<figure><img src="'+src(l.img)+'" alt="'+l.t+'" loading="lazy" /></figure>'+
      '<div class="linea-txt"><span class="n">'+l.n+'</span><h3>'+l.t+'</h3>'+
        '<p>'+l.p+'</p><ul>'+l.li.map(function(x){ return "<li>"+x+"</li>"; }).join("")+'</ul></div>';
    box.appendChild(a);
    observar(a);
  });
}, "servicios");

/* ---------- 13 bis. nuestro universo ------------------------------------- */

safe(function universo(){
  var box = $("#uvCaps");
  if(!box) return;
  UNIVERSO.forEach(function(c){
    var a = el("article","cap-item");
    a.innerHTML =
      '<figure><img src="'+src(c.img)+'" alt="'+c.sobre+' '+c.titulo+'" loading="lazy" /></figure>'+
      '<div class="cap-txt">'+
        '<span class="cap-doble"><span class="sobre">'+c.sobre+'</span>'+
        '<span class="grande">'+c.titulo+'</span></span>'+
        c.txt.map(function(p){ return "<p>"+p+"</p>"; }).join("")+
      '</div>';
    box.appendChild(a);
    observar(a);
  });
}, "universo");

/* ---------- 14. compra el espacio ---------------------------------------- */

function espCard(e){
  var b = el("article","espc");
  b.setAttribute("role","button"); b.setAttribute("tabindex","0");
  b.innerHTML = '<figure><img src="'+src(e.img)+'" alt="'+e.name+'" loading="lazy" /></figure>'+
                '<div><h3>'+e.name+'</h3><p>'+e.text+'</p></div>';
  function abrir(){ go("esp:"+e.slug); }
  b.addEventListener("click", abrir);
  b.addEventListener("keydown", function(ev){
    if(ev.key==="Enter"||ev.key===" "){ ev.preventDefault(); abrir(); }
  });
  return b;
}

safe(function espacios(){
  var l = $("#espList");
  if(l) ESPACIOS.forEach(function(e){ l.appendChild(espCard(e)); });
}, "espacios");

function openEsp(slug){
  var e = ESPACIOS.filter(function(x){ return x.slug===slug; })[0];
  if(!e) return;
  var im = $("#espImg");
  if(im){ im.src = src(e.img); im.alt = e.name; }
  var n = $("#espName"); if(n) n.textContent = e.name;
  var t = $("#espText"); if(t) t.textContent = e.text;
  crumb($("#espdCrumb"), [{t:"Inicio",go:"home"},{t:"Compra el espacio",go:"espacios"},{t:e.name}]);
  var lista = PRODUCTS.filter(function(p){ return p.esp.indexOf(slug)>=0; });
  fill($("#espGrid"), lista);
  var c = $("#espCount");
  if(c) c.textContent = lista.length + (lista.length===1 ? " pieza" : " piezas");
  show("esp");
}

/* ---------- 15. blog ----------------------------------------------------- */

function notaCard(n){
  var c = el("article","jc");
  c.innerHTML = '<figure><img src="'+src(n.img)+'" alt="'+n.t+'" loading="lazy" /></figure>'+
    '<div><span class="k">'+n.k+'</span><h3>'+n.t+'</h3><p>'+n.d+'</p>'+
    '<span class="r">'+n.r+' de lectura</span></div>';
  return c;
}

safe(function blog(){
  var g = $("#cuaGrid");
  if(g) NOTAS.forEach(function(n){ g.appendChild(notaCard(n)); });
}, "blog");

/* ---------- 16. buscador ------------------------------------------------- */

var sover = $("#sover"), sInput = $("#search"), sRes = $("#sRes"), sSug = $("#sSug");

function abrirBuscador(o){
  if(!sover) return;
  sover.hidden = !o;
  document.body.style.overflow = o ? "hidden" : "";
  if(o && sInput){ sInput.value=""; buscar(""); setTimeout(function(){ sInput.focus(); }, 60); }
}

function buscar(q){
  if(!sRes) return;
  q = q.trim().toLowerCase();
  if(sSug) sSug.style.display = q ? "none" : "";
  sRes.innerHTML = "";
  if(!q) return;
  var r = PRODUCTS.filter(function(p){
    return (p.name+" "+p.tag+" "+p.mat+" "+p.place+" "+p.style+" "+p.desc).toLowerCase().indexOf(q)>=0;
  }).slice(0,10);
  if(!r.length){
    sRes.appendChild(el("p","empty","Nada con «"+q+"». Pruebe con el material o el ambiente."));
    return;
  }
  r.forEach(function(p){
    var b = el("button","shit",
      '<img src="'+src(p.img)+'" alt="" loading="lazy" />'+
      '<span><b>'+p.name+'</b><small>'+p.tag+'</small></span>'+
      '<span class="pr">'+money(p.price)+'</span>');
    b.type = "button";
    b.addEventListener("click", function(){
      abrirBuscador(false);
      go(p.uni ? ("uni:"+p.id) : ("pdp:"+p.id));
    });
    sRes.appendChild(b);
  });
}

safe(function controlesBuscador(){
  var chips = $("#sChips");
  if(chips) ["Sofá","Travertino","Latón","Papel mural","Navidad","Lino"].forEach(function(x){
    var b = el("button",null,x); b.type="button";
    b.addEventListener("click", function(){ if(sInput){ sInput.value=x; buscar(x); } });
    chips.appendChild(b);
  });
  var abrir = function(){ abrirBuscador(true); };
  var b1 = $("#sBtn"), b2 = $("#sBtnM"), bc = $("#sClose");
  if(b1) b1.addEventListener("click", abrir);
  if(b2) b2.addEventListener("click", abrir);
  if(bc) bc.addEventListener("click", function(){ abrirBuscador(false); });
  if(sInput) sInput.addEventListener("input", function(e){ buscar(e.target.value); });
  document.addEventListener("keydown", function(e){
    if(e.key==="Escape" && sover && !sover.hidden) abrirBuscador(false);
  });
}, "controlesBuscador");

/* ---------- 17. carrito -------------------------------------------------- */

var cart = [], drawer = $("#drawer");

function openCart(o){
  if(!drawer) return;
  drawer.classList.toggle("on", o);
  drawer.setAttribute("aria-hidden", String(!o));
  sincronizarVelo();
}

function add(id,q){
  var l = cart.filter(function(x){ return x.id===String(id); })[0];
  if(l) l.q += q; else cart.push({id:String(id), q:q});
  renderCart();
}
function chg(id,d){
  var l = cart.filter(function(x){ return x.id===id; })[0];
  if(!l) return;
  l.q += d;
  if(l.q<=0) cart = cart.filter(function(x){ return x.id!==id; });
  renderCart();
}

function renderCart(){
  var box = $("#items"), badge = $("#badge"), sub = $("#subtotal");
  var total = 0, unidades = 0;
  if(box) box.innerHTML = "";
  if(!cart.length && box){
    box.appendChild(el("p","vacio","Su carrito está vacío. Cuando añada una pieza aparecerá aquí."));
  }
  cart.forEach(function(l){
    var p = byId[l.id];
    if(!p) return;
    total += p.price*l.q; unidades += l.q;
    if(!box) return;
    var n = el("div","ci",
      '<img src="'+src(p.img)+'" alt="" />'+
      '<div><b>'+p.name+'</b><small>'+p.tag+'</small>'+
        '<span class="qty"><button type="button" aria-label="Quitar uno">&minus;</button>'+
        '<span>'+l.q+'</span><button type="button" aria-label="Agregar uno">+</button></span></div>'+
      '<span class="pr">'+money(p.price*l.q)+'</span>');
    var bs = n.querySelectorAll(".qty button");
    bs[0].addEventListener("click", function(){ chg(l.id,-1); });
    bs[1].addEventListener("click", function(){ chg(l.id, 1); });
    box.appendChild(n);
  });
  if(badge){ badge.textContent = unidades; badge.setAttribute("data-cero", unidades?"0":"1"); }
  if(sub) sub.textContent = money(total);
}

safe(function controlesCarrito(){
  var b = $("#cartBtn"), c = $("#closeCart");
  if(b) b.addEventListener("click", function(){ openCart(true); });
  if(c) c.addEventListener("click", function(){ openCart(false); });
  renderCart();
}, "controlesCarrito");

/* ---------- 18. pie y formulario ----------------------------------------- */

safe(function pie(){
  var fc = $("#footCats");
  if(fc){
    TAX.forEach(function(t){
      var li = document.createElement("li");
      var b = el("button",null,t.name); b.type="button";
      b.addEventListener("click", function(){ go("cat:"+t.slug); });
      li.appendChild(b); fc.appendChild(li);
    });
    var extra = document.createElement("li");
    var be = el("button",null,"Piezas únicas"); be.type="button";
    be.addEventListener("click", function(){ go("unicos"); });
    extra.appendChild(be); fc.appendChild(extra);
  }
  $$(".fh").forEach(function(h){
    h.addEventListener("click", function(){
      var panel = h.parentElement.querySelector(".fp");
      var abierto = panel.classList.toggle("on");
      h.setAttribute("aria-expanded", String(abierto));
    });
  });
}, "pie");

safe(function formulario(){
  var f = $("#contForm");
  if(!f) return;
  f.addEventListener("submit", function(e){
    e.preventDefault();
    /* La maqueta no envía a ningún lado todavía: valida, confirma y limpia.
       Al conectar el backend, sustituir esto por el envío real. */
    var faltan = ["#cNombre","#cCorreo","#cMsg"].filter(function(sel){
      var n = $(sel);
      return !n || !n.value.trim();
    });
    if(faltan.length){
      var primero = $(faltan[0]);
      if(primero) primero.focus();
      return;
    }
    var ok = $("#contOk");
    if(ok) ok.hidden = false;
    f.reset();
  });
}, "formulario");

})();

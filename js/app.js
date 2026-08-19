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

var VIEWS = ["home","cat","pronto","pdp","uni","proyectos","proyecto","servicio",
             "nosotros","espacios","esp","cuaderno","contacto"];

/* El mundo en el que está el visitante. Proyectos, blog y contacto son los
   mismos componentes para Retail y para Hogar: lo que cambia es este valor,
   y de él cuelgan el filtro del contenido y la fila del encabezado. */
var mundoActivo = "catalogo";

function show(v, arg){
  VIEWS.forEach(function(x){
    var n = document.getElementById("v-"+x);
    if(n) n.classList.toggle("on", x===v);
  });
  window.scrollTo({top:0, behavior:"auto"});
  /* La segunda fila del encabezado sigue al mundo en el que se entra.
     En la portada se queda la del catálogo, que es la que más se usa. */
  var m = mundoDeVista(v);
  pintarFila(m);
  $$("#mundosNav button").forEach(function(b){
    b.classList.toggle("on", b.dataset.mundo===m);
  });
  $$("#paginasNav button").forEach(function(b){
    b.classList.toggle("on", b.dataset.pagina===v);
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

/* Nombre del mundo tal y como se enseña al visitante. */
function nombreMundo(id){
  var m = MUNDOS.filter(function(x){ return x.id===id; })[0];
  return m ? m.nombre : "";
}

/* Migas comunes: Inicio / <mundo> / <donde esté>. Estando en Retail o en
   Hogar, la miga del medio devuelve a esa portada de servicio. */
function migas(nodo, hoja){
  var partes = [{t:"Inicio", go:"home"}];
  if(mundoActivo==="retail" || mundoActivo==="hogar"){
    partes.push({t:nombreMundo(mundoActivo), go:mundoActivo});
  }
  partes.push({t:hoja});
  crumb(nodo, partes);
}

function go(ruta){
  var a = String(ruta).split(":"), v = a[0], arg = a[1];

  if(v==="retail" || v==="hogar"){ abrirServicio(v); return; }
  if(v==="nosotros"){ renderNosotros(); crumb($("#nsCrumb"),[{t:"Inicio",go:"home"},{t:"Quiénes somos"}]); show("nosotros"); return; }

  if(v==="cat"){ openCat(arg); return; }
  if(v==="pdp"){ openPdp(arg); return; }
  if(v==="uni"){ openUni(arg); return; }
  if(v==="esp"){ openEsp(arg); return; }
  if(v==="proyecto"){ openProyecto(arg); return; }
  if(v==="unicos"){ openCat("unicos"); return; }

  if(v==="proyectos"){
    renderProyectos();
    migas($("#proyCrumb"), "Proyectos");
    show("proyectos","proyectos"); return;
  }
  if(v==="cuaderno"){
    renderBlog();
    migas($("#cuaCrumb"), "Blog");
    show("cuaderno","cuaderno"); return;
  }
  if(v==="contacto"){ migas($("#contCrumb"), "Contacto"); show("contacto","contacto"); return; }
  if(v==="espacios"){ crumb($("#espCrumb"),[{t:"Inicio",go:"home"},{t:"Compra el espacio"}]); show("espacios","espacios"); return; }
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
      '<button class="quick" type="button">'+
        (p.uni ? "Ver la pieza" : (ECOMMERCE ? "Añadir al carrito" : "Ver la pieza"))+
      '</button></figure>'+
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
    if(!ECOMMERCE){ go("pdp:"+p.id); return; }
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

function tile(img, titulo, kicker, ruta, pronto){
  var b = el("button", "tile" + (pronto ? " tile-pronto" : "")); b.type = "button";
  b.innerHTML =
    '<img src="'+src(img)+'" alt="" loading="lazy" />'+
    '<span class="veil"></span>'+
    (pronto ? '<span class="sello">Próximamente</span>' : '')+
    '<span class="cap"><span>'+kicker+'</span><b>'+titulo+'</b></span>';
  b.addEventListener("click", function(){ go(ruta); });
  return b;
}

/* ---------- 5 bis. boceto y obra -----------------------------------------
   Dos capas en el mismo marco: el dibujo debajo y la fotografía encima,
   recortada por la posición del tirador. El control es un input de rango
   estirado sobre el marco, así que funciona con ratón, con el dedo y con el
   teclado sin escribir nada de eso a mano.

   Ni una palabra sobre la imagen: el cliente lo pidió limpio.
   ------------------------------------------------------------------------ */

/* Pieza del mosaico: el dibujo abajo, la obra encima. La obra aparece al
   pasar el cursor; en pantalla táctil, donde no hay cursor, se queda visible
   a medias para que igual se entienda el par. */
function piezaMosaico(clave, i){
  if(!tieneBoceto(clave)) return null;
  var f = el("figure","mz");
  f.innerHTML =
    '<img class="mz-sk" src="'+IMG+'sk-'+clave+'.jpg" alt="Boceto del ambiente" loading="lazy" />'+
    '<img class="mz-ob" src="'+src(clave)+'" alt="El ambiente construido" loading="lazy" />';
  f.style.setProperty("--i", i);
  return f;
}

/* Corte fijo: el dibujo debajo y la obra encima, partida por una línea. Sin
   tirador —cuatro tiradores en una misma pantalla no invitan, abruman— pero
   el corte se abre al pasar el cursor, así que la composición no está quieta. */
function parCorte(clave, corte, i){
  if(!tieneBoceto(clave)) return null;
  var f = el("figure","tb-par");
  f.style.setProperty("--c", corte+"%");
  f.style.setProperty("--i", i);
  f.innerHTML =
    '<img class="tb-sk" src="'+IMG+'sk-'+clave+'.jpg" alt="Boceto del ambiente" loading="lazy" />'+
    '<div class="tb-ob"><img src="'+src(clave)+'" alt="El mismo ambiente construido" loading="lazy" /></div>'+
    '<span class="tb-linea" aria-hidden="true"></span>';
  return f;
}

/* La tabla de trabajo con la que abre cada servicio. Cinco piezas de tamaños
   distintos: una manda y cuatro la acompañan. Los cortes arrancan desiguales
   a propósito —58, 44, 62, 38 por ciento— para que la fila no se lea como
   una tira de cajas iguales. */
function tablaTrazo(sv){
  var lista = sv.tabla || (sv.boceto ? [sv.boceto.foto] : []);
  if(!lista.length) return null;

  var envoltura = document.createDocumentFragment();
  var caja = el("div","tabla");

  /* La pieza grande conserva sus rótulos Boceto / Obra, que son los que
     explican el mecanismo. La frase larga se saca fuera: dentro de la
     rejilla partía la composición por la mitad. */
  var grande = bocetoObra(lista[0], null);
  if(grande){ caja.appendChild(grande); }

  var cortes = [58, 44, 62, 38], letras = "bcde";
  lista.slice(1,5).forEach(function(k,i){
    var p = parCorte(k, cortes[i], i+1);
    if(p){ p.classList.add("tb-"+letras[i]); caja.appendChild(p); observar(p); }
  });

  envoltura.appendChild(caja);
  if(sv.boceto && sv.boceto.pie){
    var pie = el("p","tabla-pie",
      '<span>'+sv.boceto.pie+'</span>'+
      '<em>Arrastre la pieza mayor · pase el cursor sobre las demás</em>');
    envoltura.appendChild(pie);
  }
  return envoltura;
}

function bocetoObra(clave, pie){
  if(!tieneBoceto(clave)) return null;

  var caja = el("figure","bc tb-a");
  caja.innerHTML =
    '<div class="bc-marco">'+
      '<img class="bc-sk" src="'+IMG+'sk-'+clave+'.jpg" alt="Boceto a lápiz del ambiente" loading="lazy" />'+
      '<div class="bc-obra"><img src="'+src(clave)+'" alt="El mismo ambiente, ya construido" loading="lazy" /></div>'+
      '<span class="bc-linea" aria-hidden="true"><i></i></span>'+
      '<input class="bc-rango" type="range" min="0" max="100" value="50" step="0.1" '+
             'aria-label="Deslice para pasar del boceto a la obra terminada" />'+
    '</div>'+
    '<figcaption class="bc-pie">'+
      '<span>Boceto</span>'+
      (pie ? '<em>'+pie+'</em>' : '')+
      '<span>Obra</span>'+
    '</figcaption>';

  var marco = caja.querySelector(".bc-marco");
  var rango = caja.querySelector(".bc-rango");

  function mover(){ marco.style.setProperty("--x", rango.value + "%"); }
  rango.addEventListener("input", mover);
  mover();

  return caja;
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

/* ---------- 7 bis. los tres mundos y las dos páginas ---------------------
   El negocio tiene tres servicios —Retail, Hogar y el catálogo— y dos
   páginas que no dependen de ninguno: Quiénes somos y Contacto. La cabecera
   se organiza igual: los mundos a la izquierda, las páginas a la derecha.

   Entrar a un mundo cambia la fila de abajo y filtra lo que se enseña.
   Estando en Retail, Proyectos y Blog sólo traen retail.
   ------------------------------------------------------------------------ */

var MUNDOS = [
  {id:"retail",   nombre:"Retail",   ir:"retail"},
  {id:"hogar",    nombre:"Hogar",    ir:"hogar"},
  {id:"catalogo", nombre:"Catálogo", ir:"cat:mueble",
   vistas:["cat","pronto","pdp","uni","esp","espacios"]}
];

var PAGINAS = [
  {id:"nosotros", nombre:"Quiénes somos", ir:"nosotros"},
  {id:"contacto", nombre:"Contacto",      ir:"contacto"}
];

var mundoActual = null;

/* Las vistas del catálogo se identifican solas. Proyectos, blog y contacto
   son compartidos, así que mandan el mundo en el que se entró. Las dos
   páginas fijas no pertenecen a ninguno y dejan la fila vacía. */
function mundoDeVista(v){
  if(v==="nosotros") return null;
  var m = MUNDOS.filter(function(x){ return x.vistas && x.vistas.indexOf(v)>=0; })[0];
  if(m){ mundoActivo = m.id; return m.id; }
  if(v==="contacto" && mundoActivo!=="retail") return null;
  return mundoActivo;
}

safe(function navMundos(){
  var nav = $("#mundosNav");
  if(nav) MUNDOS.forEach(function(m){
    var b = el("button",null,m.nombre); b.type="button";
    b.dataset.mundo = m.id;
    b.addEventListener("click", function(){ cerrarMega(); go(m.ir); });
    nav.appendChild(b);
  });

  var pag = $("#paginasNav");
  if(pag) PAGINAS.forEach(function(x){
    var b = el("button",null,x.nombre); b.type="button";
    b.dataset.pagina = x.id;
    b.addEventListener("click", function(){ cerrarMega(); go(x.ir); });
    pag.appendChild(b);
  });
}, "navMundos");

/* Segunda fila: se vuelve a dibujar cada vez que se cambia de mundo. */
function pintarFila(idMundo){
  var cats = $("#cats"), buscar = $("#sBtn"), fila = $(".nrow");
  if(!cats) return;
  if(mundoActual === idMundo) return;
  mundoActual = idMundo;
  cats.innerHTML = "";

  /* Quiénes somos y Contacto no cuelgan de ningún mundo: la fila desaparece
     entera en lugar de quedarse vacía ocupando sitio. */
  if(fila) fila.hidden = !idMundo;
  if(!idMundo) return;

  var finoMQ = window.matchMedia ? window.matchMedia("(hover:hover) and (pointer:fine)") : null;
  var punteroFino = function(){ return finoMQ ? finoMQ.matches : true; };

  function simple(texto, ruta, clase){
    var b = el("button",clase||null,texto); b.type="button";
    b.dataset.ruta = ruta;
    b.addEventListener("click", function(){ cerrarMega(); go(ruta); });
    return b;
  }

  if(idMundo === "retail"){
    cats.appendChild(simple("Diseño de tiendas","retail"));
    cats.appendChild(simple("Proyectos","proyectos"));
    cats.appendChild(simple("Blog","cuaderno"));
    cats.appendChild(simple("Contacto","contacto"));
    if(buscar) buscar.style.visibility = "hidden";

  } else if(idMundo === "hogar"){
    cats.appendChild(simple("Diseño de interiores","hogar"));
    cats.appendChild(simple("Espacios","espacios"));
    cats.appendChild(simple("Proyectos","proyectos"));
    cats.appendChild(simple("Blog","cuaderno"));
    if(buscar) buscar.style.visibility = "hidden";

  } else {
    /* Primero lo que ya se puede recorrer; después lo que todavía no abre,
       atenuado pero clicable: cada línea tiene su propia página. */
    catsActivas().forEach(function(t){
      var b = el("button",null,t.name); b.type="button";
      b.dataset.cat = t.slug; b.setAttribute("aria-expanded","false");
      b.addEventListener("mouseenter", function(){ if(punteroFino()) abrirMega(t,b); });
      b.addEventListener("focus", function(){ if(punteroFino()) abrirMega(t,b); });
      b.addEventListener("click", function(e){
        e.stopPropagation();
        if(punteroFino()){ cerrarMega(); openCat(t.slug); return; }
        if(megaAbierto===t.slug){ cerrarMega(); openCat(t.slug); } else { abrirMega(t,b); }
      });
      cats.appendChild(b);
    });
    cats.appendChild(simple("Piezas únicas","unicos"));
    cats.appendChild(simple("Compra el espacio","espacios"));
    cats.appendChild(el("span","hueco"));
    catsPronto().forEach(function(t){
      cats.appendChild(simple(t.name, "cat:"+t.slug, "pronto"));
    });
    if(buscar) buscar.style.visibility = "";
  }
}

/* marca la entrada activa de la segunda fila sin volver a dibujarla */
function marcarFila(v, arg){
  $$("#cats button").forEach(function(b){
    var activo = (b.dataset.cat && b.dataset.cat===arg) ||
                 (b.dataset.ruta && b.dataset.ruta===v) ||
                 (b.dataset.ruta==="cat:"+arg);
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

  /* El móvil repite el árbol tal cual: tres servicios desplegables y las dos
     páginas sueltas al final. Nada de duplicar el catálogo entero arriba. */
  function grupo(titulo, entradas){
    var acc = el("div","macc");
    var cab = el("button",null,titulo+'<span class="ar"></span>');
    cab.type="button"; cab.setAttribute("aria-expanded","false");
    var panel = el("div","mpanel mpanel-txt");
    entradas.forEach(function(e){
      var b = el("button","msub-txt" + (e[2] ? " pronto" : ""), e[1]);
      b.type="button";
      b.addEventListener("click", function(){ cerrarMovil(); go(e[0]); });
      panel.appendChild(b);
    });
    cab.addEventListener("click", function(){
      var abierto = panel.classList.toggle("on");
      cab.setAttribute("aria-expanded", String(abierto));
    });
    acc.appendChild(cab); acc.appendChild(panel);
    body.appendChild(acc);
  }

  grupo("Retail", [
    ["retail","Diseño de tiendas"],
    ["proyectos","Proyectos"],
    ["cuaderno","Blog"],
    ["contacto","Contacto"]
  ]);

  grupo("Hogar", [
    ["hogar","Diseño de interiores"],
    ["espacios","Espacios"],
    ["proyectos","Proyectos"],
    ["cuaderno","Blog"]
  ]);

  grupo("Catálogo", catsActivas().map(function(t){ return ["cat:"+t.slug, t.name]; })
    .concat([["unicos","Piezas únicas"],["espacios","Compra el espacio"]])
    .concat(catsPronto().map(function(t){ return ["cat:"+t.slug, t.name+" · pronto", true]; })));

  [["nosotros","Quiénes somos"],["contacto","Contacto"]].forEach(function(x){
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

/* ---------- 8 bis. la tienda en línea todavía no abre --------------------
   Mientras ECOMMERCE sea false se retiran el carrito y el bloque de compra.
   No se borran del marcado: el día que abra, el interruptor los devuelve.
   ------------------------------------------------------------------------ */

safe(function sinTienda(){
  if(ECOMMERCE) return;
  document.documentElement.setAttribute("data-tienda","cerrada");
  var carrito = $("#cartBtn");
  if(carrito) carrito.hidden = true;
}, "sinTienda");

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
    var abierta = (t.estado==="activo");
    hc.appendChild(tile(t.img, t.name,
      abierta ? "Disponible" : (t.temporada ? "Temporada" : "En camino"),
      "cat:"+t.slug, !abierta));
  });

  /* proyectos destacados */
  var hp = $("#homeProy");
  if(hp) [PROYECTOS[0], PROYECTOS[11], PROYECTOS[5], PROYECTOS[12]].forEach(function(pr){
    if(pr) hp.appendChild(proyCard(pr));
  });

  /* mueblería: lo único que hoy tiene catálogo de verdad */
  fill($("#homeGrid"), PRODUCTS.filter(function(p){
    return p.cat==="mueble" && !p.uni;
  }).slice(0,8));

  /* espacios */
  var he = $("#homeEsp");
  if(he) ESPACIOS.slice(0,3).forEach(function(e){ he.appendChild(espCard(e)); });

  /* compre el look: la alcoba de la campaña, con sus piezas marcadas */
  mapaConPie($("#homeMapa"), "port-alcoba",
             "Dormitorio montado por el estudio, con sus piezas señaladas");

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
  var linea = taxDe(slug);
  if(linea && linea.estado!=="activo"){ abrirPronto(linea); return; }
  mundoActivo = "catalogo";
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

/* ---------- 10. ficha de producto ----------------------------------------
   La descripción dejó de ser un acordeón de texto. Ahora es un relato con
   fotografía a ancho completo, alternando lado, y una ficha técnica corta
   junto al precio. Es lo que pidió el cliente: imágenes y aire.
   ------------------------------------------------------------------------ */

/* Ficha corta, la que se lee de pie antes de decidir. */
function renderFicha(p){
  var dl = $("#pdpFicha");
  if(!dl) return;
  var filas = [["Material", p.mat], ["Estilo", p.style], ["Ambiente", p.place],
               ["Plazo", p.lead]];
  dl.innerHTML = filas.filter(function(f){ return f[1]; }).map(function(f){
    return '<div><dt>'+f[0]+'</dt><dd>'+f[1]+'</dd></div>';
  }).join("");
}

/* El relato: cada bloque necesita su propia fotografía. Si a la pieza le
   faltan imágenes, el bloque no se dibuja — mejor tres bloques buenos que
   cinco con la misma foto repetida. */
function renderRelato(p){
  var box = $("#pdpRelato");
  if(!box) return;
  box.innerHTML = "";

  var fotos = (p.gal || []).slice();
  var bloques = [];
  if(p.desc) bloques.push(["La pieza", p.desc]);
  if(p.matx) bloques.push(["Materiales y acabado", p.matx]);
  if(p.care) bloques.push(["Cómo se cuida", p.care]);

  bloques.forEach(function(b, i){
    var foto = fotos[i] || (i===0 ? p.img : null);
    var a = el("article", "rel-bloque" + (i%2 ? " invertido" : ""));
    a.innerHTML =
      (foto ? '<figure><img src="'+src(foto)+'" alt="'+p.name+'" loading="lazy" /></figure>' : '')+
      '<div class="rel-txt"><span class="n">'+("0"+(i+1))+'</span>'+
      '<h3>'+b[0]+'</h3><p>'+b[1]+'</p></div>';
    box.appendChild(a);
    observar(a);
  });

  if(p.dims && p.dims.length){
    var med = el("article","rel-medidas");
    med.innerHTML = '<h3>Medidas</h3><table><tbody>'+
      p.dims.map(function(d){ return '<tr><th>'+d[0]+'</th><td>'+d[1]+'</td></tr>'; }).join("")+
      '</tbody></table>'+
      '<p class="rel-nota">Las piezas a medida se fabrican con las dimensiones que necesite '+
      'su espacio. Se confirman en la cotización.</p>';
    box.appendChild(med);
    observar(med);
  }
}

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
  renderFicha(p);
  renderRelato(p);

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

/* Los proyectos del mundo en el que se está. Fuera de Retail y de Hogar
   —entrando desde el pie, por ejemplo— se enseñan todos. */
function proyectosDelMundo(){
  if(mundoActivo==="retail" || mundoActivo==="hogar"){
    return PROYECTOS.filter(function(p){ return p.mundo===mundoActivo; });
  }
  return PROYECTOS;
}

function notasDelMundo(){
  if(mundoActivo==="retail" || mundoActivo==="hogar"){
    return NOTAS.filter(function(n){ return n.mundo===mundoActivo; });
  }
  return NOTAS;
}

function renderProyectos(){
  var g = $("#proyGrid");
  if(!g) return;

  var base = proyectosDelMundo();

  /* Los filtros se recalculan con las líneas que de verdad existen en este
     mundo: en Hogar no tiene sentido ofrecer "Visual merchandising". */
  var f = $("#proyFiltros");
  if(f){
    var lineas = [];
    base.forEach(function(pr){ if(lineas.indexOf(pr.linea)<0) lineas.push(pr.linea); });
    if(lineas.indexOf(filtroProy)<0) filtroProy = "todos";
    f.innerHTML = "";
    if(lineas.length>1) ["todos"].concat(lineas).forEach(function(l){
      var b = el("button",null, l==="todos" ? "Todos" : l);
      b.type = "button";
      b.setAttribute("aria-pressed", String(l===filtroProy));
      b.addEventListener("click", function(){ filtroProy = l; renderProyectos(); });
      f.appendChild(b);
    });
  }

  var lista = (filtroProy==="todos") ? base
            : base.filter(function(pr){ return pr.linea===filtroProy; });

  g.innerHTML = "";
  lista.forEach(function(pr){ g.appendChild(proyCard(pr)); });
  if(!lista.length) g.appendChild(el("p","empty","No hay proyectos en esta línea todavía."));

  var enc = $("#proyEncabezado");
  if(enc) enc.textContent = mundoActivo==="retail" ? "Proyectos de retail"
                          : mundoActivo==="hogar"  ? "Proyectos de hogar"
                          : "Todos los proyectos";
}

function renderBlog(){
  var g = $("#cuaGrid");
  if(!g) return;
  g.innerHTML = "";
  notasDelMundo().forEach(function(n){ g.appendChild(notaCard(n)); });
}

safe(function proyectos(){ renderProyectos(); }, "proyectos");

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

/* ---------- 13. la página de servicio (Retail y Hogar) -------------------
   Una sola plantilla para los dos. Lo que cambia está en SERVICIOS: la
   promesa, los entregables, el proceso y la llamada a la acción. Así los dos
   servicios se leen como el mismo estudio y no como dos landings sueltas.
   ------------------------------------------------------------------------ */

function abrirServicio(id){
  var sv = SERVICIOS[id];
  if(!sv) return;
  mundoActivo = id;
  filtroProy = "todos";

  var set = function(sel,val){ var n=$(sel); if(n) n.textContent = val; };
  var bg = $("#svBg");
  if(bg){ bg.src = src(sv.hero); bg.alt = sv.titulo; }
  set("#svEye", sv.eyebrow);
  set("#svTitulo", sv.titulo);
  set("#svPromesa", sv.promesa);
  set("#svEntTit", id==="retail" ? "De la vereda a la caja" : "De la medición a la mudanza");
  set("#svProyTit", id==="retail" ? "Tiendas que hemos hecho" : "Casas que hemos hecho");
  set("#svBlogTit", id==="retail" ? "Sobre retail" : "Sobre la casa");
  set("#svCtaT", sv.cta.t);
  set("#svCtaP", sv.cta.p);

  var b1 = $("#svCta1"), b2 = $("#svCtaB");
  if(b1){ b1.textContent = sv.cta.b; b1.onclick = function(){ go("contacto"); }; }
  if(b2){ b2.textContent = sv.cta.b; b2.onclick = function(){ go("contacto"); }; }

  var pl = $("#svProyLink"), bl = $("#svBlogLink");
  if(pl) pl.onclick = function(){ go("proyectos"); };
  if(bl) bl.onclick = function(){ go("cuaderno"); };

  /* la tabla de trabajo, justo debajo del banner */
  var bo = $("#svBoceto");
  if(bo){
    bo.innerHTML = "";
    var tab = tablaTrazo(sv);
    if(tab && tab.childNodes.length){ bo.appendChild(tab); bo.hidden = false; }
    else { bo.hidden = true; }
  }

  var cif = $("#svCifras");
  if(cif){
    cif.innerHTML = "";
    sv.cifras.forEach(function(c){
      cif.appendChild(el("div","cifra",'<b>'+c[0]+'</b><span>'+c[1]+'</span>'));
    });
  }

  var mos = $("#svMosaico");
  if(mos){
    mos.innerHTML = "";
    (sv.mosaico||[]).forEach(function(k,i){
      var pieza = piezaMosaico(k,i);
      if(pieza){ mos.appendChild(pieza); observar(pieza); }
    });
  }

  var ent = $("#svEntregables");
  if(ent){
    ent.innerHTML = "";
    sv.entregables.forEach(function(e){
      var a = el("article","ent");
      a.innerHTML = '<figure><img src="'+src(e.img)+'" alt="'+e.t+'" loading="lazy" /></figure>'+
                    '<span class="n">'+e.n+'</span><h3>'+e.t+'</h3><p>'+e.p+'</p>';
      ent.appendChild(a); observar(a);
    });
  }

  var pro = $("#svProceso");
  if(pro){
    pro.innerHTML = "";
    sv.proceso.forEach(function(x){
      var a = el("article","paso");
      a.innerHTML = '<figure><img src="'+src(x.img)+'" alt="'+x.t+'" loading="lazy" /></figure>'+
                    '<div class="paso-txt"><span class="num">'+x.n+'</span><h3>'+x.t+'</h3><p>'+x.p+'</p></div>';
      pro.appendChild(a); observar(a);
    });
  }

  var gp = $("#svProyectos");
  if(gp){
    gp.innerHTML = "";
    PROYECTOS.filter(function(pr){ return pr.mundo===id; }).slice(0,4)
             .forEach(function(pr){ gp.appendChild(proyCard(pr)); });
  }

  var gb = $("#svBlog");
  if(gb){
    gb.innerHTML = "";
    NOTAS.filter(function(n){ return n.mundo===id; }).slice(0,3)
         .forEach(function(n){ gb.appendChild(notaCard(n)); });
  }

  /* Espacios y catálogo sólo cuelgan de Hogar: es donde el visitante compra
     una pieza suelta. En Retail estorbarían. */
  var esp = $("#svEspacios"), cat = $("#svCatalogo");
  if(esp){
    esp.hidden = (id!=="hogar");
    var le = $("#svEspList");
    if(le && id==="hogar"){
      le.innerHTML = "";
      ESPACIOS.slice(0,3).forEach(function(e){ le.appendChild(espCard(e)); });
    }
  }
  if(cat){
    cat.hidden = (id!=="hogar");
    if(id==="hogar") fill($("#svCatGrid"), PRODUCTS.filter(function(x){
      return x.cat==="mueble" && !x.uni;
    }).slice(0,6));
  }

  crumb($("#svCrumb"), [{t:"Inicio",go:"home"},{t:sv.titulo}]);
  show("servicio", id);
}


/* ---------- 13 bis. quiénes somos ---------------------------------------
   La página es sobre Gian. El equipo todavía no tiene fotografía propia, así
   que se enseña con monograma: se ve intencional, no roto, y el día que
   lleguen los retratos basta con rellenar `img` en EQUIPO.
   ------------------------------------------------------------------------ */

var nosotrosListo = false;

function fichaPersona(x){
  var a = el("article","pers" + (x.destacado ? " pers-1" : ""));
  var retrato = x.img
    ? '<img src="'+src(x.img)+'" alt="'+x.n+'" loading="lazy" />'
    : '<span class="mono" aria-hidden="true">'+x.ini+'</span>';
  a.innerHTML = '<figure class="pers-foto">'+retrato+'</figure>'+
                '<div class="pers-txt"><h3>'+x.n+'</h3>'+
                '<span class="rol">'+x.rol+'</span><p>'+x.p+'</p></div>';
  return a;
}

function renderNosotros(){
  mundoActivo = null;
  if(nosotrosListo) return;
  nosotrosListo = true;

  var foto = $("#nsFoto");
  if(foto) foto.innerHTML = '<span class="mono grande" aria-hidden="true">G</span>'+
                            '<span class="pend">Retrato pendiente</span>';

  var cif = $("#nsCifras");
  if(cif) CIFRAS_ESTUDIO.forEach(function(c){
    cif.appendChild(el("div","cifra",'<b>'+c[0]+'</b><span>'+c[1]+'</span>'));
  });

  var his = $("#nsHistoria");
  if(his) HISTORIA.forEach(function(h){
    var a = el("article","cap-item");
    a.innerHTML = '<figure><img src="'+src(h.img)+'" alt="'+h.t+'" loading="lazy" /></figure>'+
      '<div class="cap-txt"><span class="cap-doble"><span class="sobre">'+h.a+'</span>'+
      '<span class="grande">'+h.t+'</span></span><p>'+h.p+'</p></div>';
    his.appendChild(a); observar(a);
  });

  var eq = $("#nsEquipo");
  if(eq) EQUIPO.forEach(function(x){ eq.appendChild(fichaPersona(x)); });

  var pr = $("#nsProy");
  if(pr) [PROYECTOS[0], PROYECTOS[6], PROYECTOS[9], PROYECTOS[11]].forEach(function(x){
    if(x) pr.appendChild(proyCard(x));
  });
}


/* ---------- 13 quater. una línea que todavía no abre ---------------------
   Un enlace muerto en un menú resta más que una línea de menos. Cada línea
   por abrir tiene su propia página: dice qué va a haber, cuándo, y ofrece la
   única vía que hoy sí existe, que es el encargo directo.
   ------------------------------------------------------------------------ */

function abrirPronto(t){
  mundoActivo = "catalogo";
  var set = function(sel,val){ var n=$(sel); if(n) n.textContent = val; };
  var im = $("#prontoImg");
  if(im){ im.src = src(t.img); im.alt = t.name; }
  set("#prontoCuando", t.temporada ? "Campaña de temporada · "+t.cuando : "Disponible en "+t.cuando);
  set("#prontoTitulo", t.name);
  set("#prontoLede", t.lede);

  var ul = $("#prontoSubs");
  if(ul){
    ul.innerHTML = "";
    t.subs.forEach(function(x){ ul.appendChild(el("li",null,x.name)); });
  }
  crumb($("#prCrumb"), [{t:"Inicio",go:"home"},{t:"Catálogo",go:"cat:mueble"},{t:t.name}]);
  show("pronto", t.slug);
}

/* ---------- 13 ter. mapa de piezas sobre la foto -------------------------
   Monta una imagen con los puntos de sus piezas. Devuelve true si llegó a
   poner puntos, para que quien la llame sepa si añadir el pie explicativo.

   La imagen se deja a su proporción natural (nada de object-fit: cover):
   los puntos van en porcentaje y cualquier recorte los movería de sitio.
   ------------------------------------------------------------------------ */

function montarMapa(cont, clave, alt){
  if(!cont) return false;
  cont.classList.add("mapa");
  cont.innerHTML = '<img src="'+src(clave)+'" alt="'+(alt||"")+'" />';

  var pts = (typeof PUNTOS !== "undefined" && PUNTOS[clave]) || [];
  pts = pts.filter(function(pt){ return byId[pt.id]; });
  if(!pts.length) return false;

  var tarjeta = el("div","pin-card");
  tarjeta.hidden = true;
  var abierto = -1, botones = [];

  function cerrar(){
    abierto = -1;
    tarjeta.hidden = true;
    cont.classList.remove("hay-abierto");
    botones.forEach(function(b){ b.setAttribute("aria-expanded","false"); });
  }

  /* Coloca la tarjeta junto a su punto sin que se salga de la foto:
     si no cabe a la derecha se va a la izquierda, y si no cabe abajo
     sube. En pantalla estrecha se ancla al pie y ocupa el ancho. */
  function colocar(b){
    var W = cont.clientWidth, H = cont.clientHeight;
    if(W < 560){ cont.classList.add("card-abajo"); return; }
    cont.classList.remove("card-abajo");
    var cw = tarjeta.offsetWidth, ch = tarjeta.offsetHeight;
    var px = b.offsetLeft, py = b.offsetTop, sep = 24, margen = 14;

    var x = px + sep;
    if(x + cw > W - margen) x = px - cw - sep;
    if(x < margen) x = Math.max(margen, Math.min((W - cw) / 2, W - cw - margen));

    var y = py + sep;
    if(y + ch > H - margen) y = py - ch - sep;
    if(y < margen) y = margen;

    tarjeta.style.left = x + "px";
    tarjeta.style.top  = y + "px";
  }

  function abrir(i, b, p){
    if(abierto === i){ cerrar(); return; }
    cerrar();
    abierto = i;
    tarjeta.innerHTML =
      '<img src="'+src(p.img)+'" alt="" loading="lazy" />'+
      '<span><span class="k">'+(p.uni ? "Pieza única" : p.mat)+'</span>'+
      '<b>'+p.name+'</b><small>'+p.tag+'</small>'+
      '<span class="pr">'+(p.colors.length>1 ? "Desde " : "")+money(p.price)+'</span></span>';
    tarjeta.hidden = false;
    cont.classList.add("hay-abierto");
    b.setAttribute("aria-expanded","true");
    colocar(b);
    tarjeta.onclick = function(ev){
      ev.stopPropagation();
      go(p.uni ? ("uni:"+p.id) : ("pdp:"+p.id));
    };
  }

  pts.forEach(function(pt,i){
    var p = byId[pt.id];
    var b = el("button","pin"); b.type = "button";
    b.style.left = pt.x + "%";
    b.style.top  = pt.y + "%";
    b.setAttribute("aria-label", "Ver "+p.name+" — "+p.tag+", "+money(p.price));
    b.setAttribute("aria-expanded","false");
    b.addEventListener("click", function(e){ e.stopPropagation(); abrir(i,b,p); });
    botones.push(b);
    cont.appendChild(b);
  });

  cont.appendChild(tarjeta);
  cont.addEventListener("click", function(){ cerrar(); });
  document.addEventListener("keydown", function(e){ if(e.key==="Escape") cerrar(); });
  window.addEventListener("resize", function(){
    if(abierto >= 0 && botones[abierto]) colocar(botones[abierto]);
  });

  return true;
}

/* Envuelve el mapa y le añade el pie que explica para qué son los puntos. */
function mapaConPie(cont, clave, alt){
  var hay = montarMapa(cont, clave, alt);
  if(!hay) return false;
  var pie = el("p","mapa-pie",'<i></i><span>Toque los puntos para ver cada pieza</span>');
  if(cont.parentNode) cont.parentNode.insertBefore(pie, cont.nextSibling);
  return true;
}

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
  var caja = $("#espMapa");
  if(caja){
    /* se vuelve a montar en cada entrada: cada espacio trae sus puntos */
    var pieViejo = caja.parentNode && caja.parentNode.querySelector(".mapa-pie");
    if(pieViejo) pieViejo.remove();
    mapaConPie(caja, e.img, e.name);
  }
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

safe(function blog(){ renderBlog(); }, "blog");

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
      var abierta = (t.estado==="activo");
      var b = el("button", abierta ? null : "pronto",
                 t.name + (abierta ? "" : ' <i>pronto</i>'));
      b.type="button";
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

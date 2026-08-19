/* ==========================================================================
   GIANDECO — contenido de la maqueta
   --------------------------------------------------------------------------
   Todo el contenido vive aquí, separado del comportamiento. Los productos,
   precios y fichas son de ejemplo: sirven para validar estructura y diseño.
   Las fotografías sí son del banco real del estudio (carpetas 02 a 15 del
   banco aprobado; nada de la carpeta 90, pendiente de confirmar autoría).
   ========================================================================== */

var IMG = "img/";

var money = function(n){ return "S/ " + n.toLocaleString("es-PE"); };

var COLOR = {
  crudo:"#D8CBB4", arena:"#C0A87F", verde:"#3B4A38", burdeos:"#7A2A34",
  oro:"#C08F4A", madera:"#7A5B3C", negro:"#2B2724", ambar:"#B5762A"
};

/* ---------- taxonomía del catálogo --------------------------------------
   Fase 1 del negocio: la tienda todavía no vende en línea. Mueblería es la
   única línea con catálogo propio; Piezas únicas y Compra el espacio también
   se pueden recorrer. El resto se anuncia con su propia página de próxima
   apertura, nunca con un enlace muerto.

   Para abrir una línea basta con cambiar su `estado` a "activo": el menú, la
   portada y el catálogo se reordenan solos.
   ------------------------------------------------------------------------ */

/* Interruptor de la tienda en línea. En false el sitio funciona como catálogo
   con cotización: no hay carrito ni pago, y cada pieza lleva a una consulta.
   Ponerlo en true el día que se abra el ecommerce. */
var ECOMMERCE = false;

var TAX = [
  {slug:"mueble", name:"Mueblería", img:"cat-muebles", estado:"activo",
   lede:"Taller propio. Del plano de despiece a la pieza instalada, sin tercerizar el control.",
   subs:[
    {s:"asientos", name:"Asientos"},
    {s:"mesas", name:"Mesas"},
    {s:"guardado", name:"Guardado"}]},

  {slug:"iluminacion", name:"Iluminación", img:"cat-iluminacion", estado:"pronto",
   cuando:"Primer trimestre de 2027",
   lede:"Colgantes, lámparas de pie y de mesa, seleccionadas con el mismo criterio que usamos en obra.",
   subs:[{s:"mesa", name:"De mesa"}, {s:"pie", name:"De pie"}, {s:"colgante", name:"Colgantes"}]},

  {slug:"decoracion", name:"Decoración", img:"cat-decoracion", estado:"pronto",
   cuando:"Primer trimestre de 2027",
   lede:"Espejos, objetos, jarrones y textiles. La capa que termina un ambiente.",
   subs:[{s:"espejos", name:"Espejos"}, {s:"objetos", name:"Objetos"},
         {s:"jarrones", name:"Jarrones"}, {s:"textiles", name:"Textiles"}]},

  {slug:"papel", name:"Papel mural", img:"cat-papel", estado:"pronto",
   cuando:"Primer trimestre de 2027",
   lede:"Panorámicos y diseños de repetición, medidos e instalados por el estudio.",
   subs:[{s:"panoramico", name:"Panorámicos"}, {s:"repetido", name:"De repetición"}]},

];

/* La campaña de temporada abre el catálogo mientras está viva. Se coloca
   delante en vez de reordenar el array a mano: así, cuando termine, basta
   con poner `temporada:false` y todo vuelve a su sitio. */
TAX.unshift(
  {slug:"navidad", name:"Navidad", img:"navid-1", estado:"activo", temporada:true,
   lede:"Árbol, vitrina, mesa y luces. La misma campaña que montamos en salas de venta, para su casa.",
   campana:{
     eyebrow:"Campaña de temporada · 2026",
     titulo:"La Navidad, montada",
     texto:"El estudio arma la temporada completa: árbol, corona, mesa puesta y luces. Se monta en diciembre y se desmonta y guarda rotulado la primera semana de enero.",
     foto:"navid-1",
     apoyo:["navid-2","navid-3","navid-4"],
     cta:"Pedir el montaje completo"
   },
   subs:[{s:"arboles", name:"Árboles"}, {s:"coronas", name:"Coronas y guirnaldas"},
         {s:"mesa", name:"Mesa navideña"}, {s:"ornamentos", name:"Ornamentos"}, {s:"luces", name:"Luces"}]}
);

function taxDe(slug){ return TAX.filter(function(t){ return t.slug===slug; })[0]; }
function catsActivas(){ return TAX.filter(function(t){ return t.estado==="activo"; }); }
function catsPronto(){ return TAX.filter(function(t){ return t.estado!=="activo"; }); }

/* ---------- productos ---------------------------------------------------- */

function P(id,name,tag,cat,sub,price,colors,img,o){
  o = o || {};
  return {id:id, name:name, tag:tag, cat:cat, sub:sub, price:price, colors:colors, img:img,
    stock:o.stock||"ok", uni:!!o.uni, esp:o.esp||[], style:o.style||"Neoclásico", place:o.place||"Sala",
    mat:o.mat||"Madera", dims:o.dims||[], lead:o.lead||"3 semanas", desc:o.desc||"", care:o.care||"",
    matx:o.matx||"", story:o.story||"", prov:o.prov||"", gal:o.gal||[]};
}

var PRODUCTS = [
 P(1,"Barranco","Sofá de 3 cuerpos","asientos","sofas",4650,["crudo","verde","burdeos"],"p-sofa-3",
  {mat:"Bouclé",place:"Sala",style:"Contemporáneo",lead:"6 a 8 semanas",esp:["cg-sala"],
   gal:["p-sofa-1","p-sofa-2","p-sofa-4"],
   dims:[["Ancho","230 cm"],["Fondo","95 cm"],["Alto","78 cm"],["Alto de asiento","44 cm"],["Peso","62 kg"]],
   desc:"Tres cuerpos de líneas bajas y brazo ancho, pensado para sentarse de verdad y no solo para mirar. El asiento combina espuma de alta densidad con una envoltura de plumón: cede al sentarse y recupera la forma.",
   matx:"Tapiz bouclé de algodón y poliéster, desenfundable. Estructura de madera de tornillo secada al horno. Patas de roble macizo con acabado al aceite.",
   care:"Aspirar con boquilla suave cada dos semanas. Las manchas se levantan con paño húmedo y jabón neutro, del borde hacia el centro. No usar blanqueadores."}),
 P(2,"Miraflores","Sofá de 2 cuerpos","asientos","sofas",3890,["crudo","arena"],"p-sofa-2",
  {mat:"Lino",place:"Sala",lead:"6 semanas",esp:["cg-sala"],gal:["p-sofa-1","p-sofa-4"],
   dims:[["Ancho","178 cm"],["Fondo","92 cm"],["Alto","76 cm"],["Peso","48 kg"]],
   desc:"La versión de dos cuerpos del Barranco, para departamentos donde el metraje manda. Mismo asiento, mismo brazo, 52 cm menos de ancho.",
   matx:"Lino lavado 100 % natural, desenfundable. Estructura de madera de tornillo.",
   care:"Lavado en seco de las fundas. El lino se arruga: es parte del material, no un defecto."}),
 P(3,"Chorrillos","Sillón de lectura","asientos","sillones",2180,["crudo","verde"],"p-sillon-1",
  {mat:"Lino",place:"Dormitorio",lead:"6 semanas",esp:["cg-sala","cg-hab"],gal:["p-sillon-2"],
   dims:[["Ancho","78 cm"],["Fondo","82 cm"],["Alto","74 cm"],["Alto de asiento","42 cm"]],
   desc:"Sillón de respaldo inclinado, pensado para leer una hora sin cambiar de postura. Incluye cojín lumbar del mismo tejido.",
   matx:"Lino crudo lavado sobre estructura de roble macizo.",
   care:"Aspirado suave. Rotar el cojín cada mes para que asiente parejo."}),
 P(4,"Paracas","Tumbona de exterior","asientos","tumbonas",1980,["arena","madera"],"esp-terraza",
  {mat:"Teca",place:"Terraza",style:"Contemporáneo",lead:"4 semanas",esp:["bosque"],
   dims:[["Largo","195 cm"],["Ancho","68 cm"],["Alto","36 cm"]],
   desc:"Tumbona de teca con respaldo de cuatro posiciones y ruedas ocultas en las patas traseras. Resiste el verano limeño y la humedad de la garúa.",
   matx:"Teca de plantación certificada, sin tratar. Colchoneta de tejido acrílico solution-dyed.",
   care:"La teca sin tratar toma una pátina gris plata en unos seis meses. Si prefiere el tono miel original, aplicar aceite de teca dos veces al año."}),
 P(5,"Ancón","Banco tapizado","asientos","bancos",890,["crudo","burdeos"],"p-banco-1",
  {mat:"Bouclé",place:"Dormitorio",lead:"3 semanas",esp:["cg-hab"],
   dims:[["Ancho","120 cm"],["Fondo","40 cm"],["Alto","46 cm"]],
   desc:"Banco de pie de cama o de recibidor. Firme para sentarse a ponerse los zapatos, discreto para no estorbar.",
   matx:"Bouclé sobre estructura de madera. Patas de latón macizo.",
   care:"Aspirar. Evitar la exposición directa al sol para que el bouclé no amarillee."}),
 P(6,"Sillar","Puf redondo","asientos","bancos",620,["arena","verde"],"p-sillon-2",
  {mat:"Lino",place:"Sala",lead:"Entrega inmediata",stock:"low",esp:["cg-sala","bosque"],
   dims:[["Diámetro","55 cm"],["Alto","42 cm"]],
   desc:"Puf de relleno firme que funciona como asiento extra o como mesa auxiliar con una bandeja encima.",
   matx:"Funda de lino con cierre invisible. Relleno de fibra de poliéster de alta densidad.",
   care:"Funda lavable en seco."}),
 P(7,"San Isidro","Silla de comedor","asientos","sillas",780,["crudo","negro"],"p-silla-1",
  {mat:"Roble",place:"Comedor",lead:"4 semanas",esp:["cg-comedor"],gal:["p-silla-2"],
   dims:[["Ancho","46 cm"],["Fondo","52 cm"],["Alto","86 cm"],["Alto de asiento","46 cm"]],
   desc:"Silla de comedor con respaldo curvo y asiento tapizado. Apilable de a tres para guardarla cuando no hay visitas.",
   matx:"Roble macizo con acabado al aceite. Asiento tapizado en lino.",
   care:"Paño seco para la madera. Ajustar los tornillos del asiento una vez al año."}),
 P(8,"Arenales","Silla de bar","asientos","barra",940,["negro","oro"],"p-silla-2",
  {mat:"Latón",place:"Cocina",lead:"4 semanas",
   dims:[["Ancho","42 cm"],["Fondo","46 cm"],["Alto total","104 cm"],["Alto de asiento","74 cm"]],
   desc:"Silla alta para barra de cocina o isla, con reposapiés de latón y asiento giratorio de 360°.",
   matx:"Estructura de acero con acabado latón envejecido. Asiento tapizado en cuerina.",
   care:"Limpiar el latón con paño seco. No usar limpiadores abrasivos: se llevan la pátina."}),
 P(9,"Travertino","Mesa de centro","muebles","centro",2890,["crudo"],"p-mesa-2",
  {mat:"Travertino",place:"Sala",lead:"3 semanas",esp:["cg-sala"],gal:["p-objeto-2"],
   dims:[["Largo","110 cm"],["Ancho","60 cm"],["Alto","38 cm"],["Peso","78 kg"]],
   desc:"Bloque de travertino romano con el canto irregular pulido a mano. Cada pieza tiene su propio veteado: no hay dos iguales, y por eso la que reciba no será idéntica a la de la foto.",
   matx:"Travertino natural sellado con producto de penetración mate. Base de acero oculta.",
   care:"El travertino es poroso: limpiar los derrames de inmediato, sobre todo vino y cítricos. Resellar cada dos años."}),
 P(10,"Lúcuma","Mesa lateral","muebles","centro",1680,["crudo"],"p-objeto-2",
  {mat:"Travertino",place:"Sala",lead:"3 semanas",esp:["cg-sala"],
   dims:[["Diámetro","40 cm"],["Alto","52 cm"],["Peso","34 kg"]],
   desc:"Cilindro de travertino tallado de un solo bloque. Pesa 34 kg: se instala una vez y no se vuelve a mover.",
   matx:"Travertino natural sellado mate.",
   care:"Igual que la mesa de centro: sellado cada dos años y nada de ácidos."}),
 P(11,"Quinua","Mesa de comedor","muebles","comedor",5200,["madera"],"p-mesa-1",
  {mat:"Roble",place:"Comedor",lead:"8 semanas",esp:["cg-comedor"],gal:["p-mesa-2","p-mesapuesta-2"],
   dims:[["Largo","220 cm"],["Ancho","100 cm"],["Alto","76 cm"],["Comensales","8 a 10"]],
   desc:"Mesa de comedor de tablón macizo con junta viva al centro. Para ocho cómodos, diez apretados.",
   matx:"Roble macizo europeo, acabado al aceite duro.",
   care:"El aceite se retoca en casa: un paño, aceite duro y media hora. Evitar apoyar ollas calientes."}),
 P(12,"Chala","Consola","muebles","consolas",3240,["madera","crudo"],"p-consola-1",
  {mat:"Roble",place:"Recibidor",lead:"5 semanas",esp:["cg-sala"],gal:["p-consola-2"],
   dims:[["Largo","160 cm"],["Fondo","40 cm"],["Alto","80 cm"]],
   desc:"Consola de recibidor con dos cajones de cierre suave y repisa inferior. Cabe detrás de un sofá o contra una pared ciega.",
   matx:"Roble macizo y enchapado de roble sobre MDF hidrófugo. Tiradores de latón.",
   care:"Paño apenas húmedo. Retocar con aceite una vez al año."}),
 P(13,"Pacae","Cómoda de tres cajones","muebles","comodas",3980,["madera","negro"],"p-consola-2",
  {mat:"Roble",place:"Dormitorio",lead:"6 semanas",esp:["cg-hab"],
   dims:[["Ancho","120 cm"],["Fondo","48 cm"],["Alto","82 cm"]],
   desc:"Cómoda de tres cajones amplios con correderas de extracción total. Los cajones llegan hasta el fondo: se usa todo el volumen.",
   matx:"Estructura de roble, cajones con fondo de cedro. Correderas metálicas con freno.",
   care:"No cargar el cajón superior con más de 15 kg."}),
 P(14,"Molle","Mesa de noche","muebles","noche",1120,["madera","crudo"],"p-objeto-3",
  {mat:"Roble",place:"Dormitorio",lead:"4 semanas",esp:["cg-hab"],
   dims:[["Ancho","45 cm"],["Fondo","38 cm"],["Alto","55 cm"]],
   desc:"Mesa de noche de un cajón y repisa abierta, a la altura justa de un colchón estándar con base.",
   matx:"Roble macizo, tirador de latón.", care:"Paño seco."}),
 P(15,"Sillar","Librero","muebles","libreros",4100,["madera"],"p-librero-1",
  {mat:"Roble",place:"Estudio",lead:"7 semanas",
   dims:[["Ancho","180 cm"],["Fondo","36 cm"],["Alto","210 cm"]],
   desc:"Librero de cinco niveles con montantes pasantes. Se ancla a la pared: en Lima eso no es opcional.",
   matx:"Roble macizo y estantes de 25 mm. Incluye anclajes sísmicos.",
   care:"Repartir el peso: los libros pesados abajo."}),
 P(16,"Yeso","Lámpara de mesa","iluminacion","mesa",890,["crudo","oro"],"p-lampara-1",
  {mat:"Cerámica",place:"Sala",lead:"2 semanas",esp:["cg-hab"],gal:["p-lampara-3"],
   dims:[["Diámetro pantalla","32 cm"],["Alto total","58 cm"],["Casquillo","E27"]],
   desc:"Base torneada en cerámica esmaltada mate con pantalla de lino natural. Da luz cálida y difusa, no un foco al ojo.",
   matx:"Cerámica esmaltada mate. Pantalla de lino sobre estructura metálica. Cable textil trenzado de 2 m.",
   care:"Quitar el polvo de la pantalla con cepillo suave. Dimerizable con LED regulable."}),
 P(17,"Cañón","Lámpara de pie","iluminacion","pie",1340,["oro","negro"],"p-lampara-3",
  {mat:"Latón",place:"Sala",lead:"3 semanas",esp:["cg-sala","bosque"],
   dims:[["Diámetro base","30 cm"],["Alto","165 cm"],["Casquillo","E27"]],
   desc:"Lámpara de pie de tubo de latón con pantalla orientable. Para poner al lado del sillón de lectura.",
   matx:"Latón macizo con pátina envejecida. Base contrapesada de acero.",
   care:"Paño seco sobre el latón; la pátina se profundiza con el tiempo."}),
 P(18,"Totora","Colgante de fibra","iluminacion","colgante",1180,["arena"],"p-lampara-2",
  {mat:"Fibra",place:"Comedor",style:"Artesanal",lead:"5 semanas",esp:["cg-comedor"],
   dims:[["Diámetro","55 cm"],["Alto","40 cm"],["Cable","150 cm regulable"]],
   desc:"Pantalla tejida a mano en fibra natural por artesanas de Catacaos. La luz sale filtrada por el tejido y dibuja sombras en el techo.",
   matx:"Fibra vegetal trenzada sobre aro metálico. Rosetón y cable en latón.",
   care:"Aspirar con boquilla de cepillo. No mojar."}),
 P(19,"Lima","Hurricane de vidrio","decoracion","objetos",320,["oro","crudo"],"p-objeto-1",
  {mat:"Vidrio",place:"Sala",lead:"Entrega inmediata",stock:"low",esp:["cg-comedor","navidad"],
   dims:[["Diámetro","14 cm"],["Alto","30 cm"]],
   desc:"Hurricane de vidrio soplado con aro de latón envejecido. Admite vela de hasta 8 cm de diámetro y protege la llama del viento de terraza.",
   matx:"Vidrio soplado a boca. Aro de latón envejecido.",
   care:"Lavar a mano con agua tibia. El aro de latón no va al lavavajillas."}),
 P(20,"Ámbar","Jarrón de vidrio","decoracion","jarrones",240,["ambar"],"p-jarron-2",
  {mat:"Vidrio",place:"Comedor",lead:"Entrega inmediata",esp:["cg-comedor","navidad"],gal:["p-jarron-1"],
   dims:[["Diámetro","18 cm"],["Alto","26 cm"],["Boca","9 cm"]],
   desc:"Jarrón de vidrio ámbar soplado a boca. El tono cambia según la luz que reciba: más miel de mañana, más caramelo al atardecer.",
   matx:"Vidrio soplado artesanal. Cada pieza tiene burbujas y variaciones de espesor.",
   care:"Lavar a mano."}),
 P(21,"Barranco","Espejo de latón","decoracion","espejos",1450,["oro"],"p-espejo-1",
  {mat:"Latón",place:"Recibidor",lead:"3 semanas",esp:["cg-sala","navidad"],gal:["p-espejo-2"],
   dims:[["Diámetro","90 cm"],["Profundidad","4 cm"],["Peso","11 kg"]],
   desc:"Espejo circular con marco de latón envejecido a mano, pieza por pieza. Se cuelga horizontal sobre una consola o vertical en un pasillo angosto.",
   matx:"Marco de latón macizo con pátina aplicada a mano. Luna de 5 mm con respaldo protegido.",
   care:"Limpiar la luna con paño de microfibra apenas húmedo, nunca el marco con líquidos."}),
 P(22,"Chorrillos","Bandeja de latón","decoracion","objetos",390,["oro"],"p-jarron-1",
  {mat:"Latón",place:"Sala",lead:"Entrega inmediata",stock:"out",esp:["cg-comedor"],
   dims:[["Largo","42 cm"],["Ancho","28 cm"],["Alto","4 cm"]],
   desc:"Bandeja rectangular de latón pulido con base de fieltro. Ordena la mesa de centro sin ocuparla del todo.",
   matx:"Latón pulido con laca protectora. Base de fieltro.",
   care:"Paño seco. La laca evita que oxide, pero no la meta al agua."}),
 P(23,"Arena","Cojín de lino","decoracion","textiles",145,["arena","crudo","verde"],"p-textil-1",
  {mat:"Lino",place:"Sala",lead:"Entrega inmediata",esp:["cg-sala","navidad"],
   dims:[["Medida","50 × 50 cm"],["Relleno","Pluma incluida"]],
   desc:"Funda de lino lavado con cierre invisible, relleno de pluma incluido. El lino lavado ya viene suave: no hay periodo de adaptación.",
   matx:"Lino 100 % lavado en prenda. Relleno de pluma de pato con funda interior de algodón.",
   care:"Lavado a máquina en frío, ciclo suave. Secar a la sombra."}),
 P(24,"Amazonas","Papel mural panorámico","papel","panoramico",180,["verde"],"p-papel-1",
  {mat:"Papel",place:"Dormitorio",style:"Botánico",lead:"2 semanas",esp:["cg-hab"],
   gal:["p-papel-2","p-papel-3"],
   dims:[["Rollo","10 × 0.53 m"],["Rendimiento","5 m² aprox."],["Repetición","64 cm"]],
   desc:"Papel mural botánico impreso en no tejido, en verdes profundos sobre fondo cálido. Funciona muy bien en medio baño, donde una pared con carácter cambia todo el ambiente.",
   matx:"Papel no tejido de 150 g, acabado mate. Tinta al agua, sin solventes.",
   care:"Limpiar con esponja apenas húmeda. Apto para baños con ventilación."}),
 P(34,"Chinoiserie","Panel decorativo","papel","panoramico",340,["oro","negro"],"p-papel-2",
  {mat:"Papel",place:"Comedor",style:"Clásico",lead:"3 semanas",gal:["p-papel-4"],
   dims:[["Panel","2.80 × 1.20 m"],["Paneles por juego","2"],["Montaje","Encolado en pared"]],
   desc:"Panel de chinoiserie sobre fondo profundo, impreso y montado como pieza enmarcada. Es la manera de tener una pared de carácter sin empapelar el ambiente completo.",
   matx:"Impresión sobre no tejido montada en bastidor con moldura de latón envejecido.",
   care:"Plumero suave. No aplicar líquidos sobre la impresión."}),
 P(35,"Sepia","Papel mural de repetición","papel","repetido",150,["crudo","arena"],"p-papel-3",
  {mat:"Papel",place:"Recibidor",style:"Clásico",lead:"2 semanas",
   dims:[["Rollo","10 × 0.53 m"],["Rendimiento","5 m² aprox."],["Repetición","32 cm"]],
   desc:"Escena de repetición en sepia sobre fondo cálido, del tipo toile clásico. Ordena un pasillo largo o un comedor sin ventanas.",
   matx:"Papel no tejido de 150 g, acabado mate.",
   care:"Esponja apenas húmeda."}),
 P(36,"Bruma","Papel mural de repetición","papel","repetido",150,["crudo"],"p-papel-4",
  {mat:"Papel",place:"Dormitorio",style:"Clásico",lead:"2 semanas",
   dims:[["Rollo","10 × 0.53 m"],["Rendimiento","5 m² aprox."],["Repetición","32 cm"]],
   desc:"La versión clara del Sepia, para ambientes donde entra poca luz natural y un papel oscuro cerraría el espacio.",
   matx:"Papel no tejido de 150 g, acabado mate.",
   care:"Esponja apenas húmeda."}),
 P(37,"Marfil","Vajilla de mesa, 12 piezas","decoracion","objetos",480,["crudo","verde"],"p-mesapuesta-2",
  {mat:"Cerámica",place:"Comedor",lead:"Entrega inmediata",esp:["cg-comedor"],gal:["p-mesapuesta-1"],
   dims:[["Plato llano","27 cm"],["Plato hondo","22 cm"],["Servicio","4 puestos"]],
   desc:"Cuatro puestos completos de gres esmaltado en tono marfil con borde irregular. Va al horno, al microondas y al lavavajillas: es vajilla de usar, no de vitrina.",
   matx:"Gres esmaltado a alta temperatura. Cada pieza tiene variaciones de esmalte.",
   care:"Apto para lavavajillas. No someter a cambios bruscos de temperatura."}),

 P(27,"Nevado","Árbol de 2.10 m","navidad","arboles",1290,["verde","crudo"],"p-nav-1",
  {mat:"Fibra",place:"Sala",style:"Navidad",lead:"Entrega en 48 horas",esp:["navidad"],gal:["p-nav-2"],
   dims:[["Alto","210 cm"],["Diámetro base","120 cm"],["Ramas","1,450"],["Armado","3 secciones"]],
   desc:"Árbol de punta nevada y rama densa, del tipo que usamos en las campañas de tienda. La densidad es lo que hace la diferencia: un árbol ralo no se salva con más adornos.",
   matx:"Fibra PVC con alma de acero galvanizado. Base metálica plegable incluida.",
   care:"Guardar desarmado en su caja, en lugar seco. Esponjar las ramas al montarlo: toma quince minutos y cambia el resultado."}),
 P(28,"Dorado","Árbol de 1.80 m","navidad","arboles",980,["oro","verde"],"p-nav-2",
  {mat:"Fibra",place:"Recibidor",style:"Navidad",lead:"Entrega en 48 horas",esp:["navidad"],
   dims:[["Alto","180 cm"],["Diámetro base","100 cm"],["Ramas","1,050"]],
   desc:"Versión de 1.80 m con punta dorada, pensada para departamentos y recibidores donde 2.10 m se come el espacio.",
   matx:"Fibra PVC con detalle dorado en punta de rama. Base metálica plegable.",
   care:"Igual que el Nevado: desarmado, seco y esponjado al montar."}),
 P(29,"Follaje","Corona de puerta","navidad","coronas",320,["verde","burdeos"],"p-nav-3",
  {mat:"Fibra",place:"Recibidor",style:"Navidad",lead:"Entrega inmediata",stock:"low",esp:["navidad"],
   dims:[["Diámetro","60 cm"],["Profundidad","14 cm"]],
   desc:"Corona de follaje mixto con lazo de terciopelo. Va en la puerta de calle y aguanta la humedad de la garúa sin decolorarse.",
   matx:"Follaje de fibra tratada, lazo de terciopelo, alma de alambre forrado.",
   care:"Guardar colgada, nunca aplastada dentro de una caja."}),
 P(30,"Pino","Guirnalda de 2.70 m","navidad","coronas",280,["verde"],"p-nav-5",
  {mat:"Fibra",place:"Comedor",style:"Navidad",lead:"Entrega inmediata",esp:["navidad"],
   dims:[["Largo","270 cm"],["Ancho","30 cm"]],
   desc:"Guirnalda para baranda de escalera, marco de chimenea o el largo de una mesa de comedor.",
   matx:"Follaje de fibra sobre alma de alambre moldeable.",
   care:"Se enrolla para guardar; el alambre recupera la forma al año siguiente."}),
 P(31,"Diciembre","Juego de mesa navideña","navidad","mesa",890,["crudo","verde","burdeos"],"p-mesapuesta-1",
  {mat:"Lino",place:"Comedor",style:"Navidad",lead:"Entrega en 48 horas",esp:["navidad","cg-comedor"],
   dims:[["Camino de mesa","180 × 40 cm"],["Individuales","6 unidades"],["Servilletas","6 unidades"]],
   desc:"Camino de mesa, seis individuales y seis servilletas de lino bordado, en la paleta verde y crudo que usamos en las mesas del showroom.",
   matx:"Lino con bordado a máquina. Servilleteros de latón vendidos aparte.",
   care:"Lavado a máquina en frío, plancha tibia por el revés."}),
 P(32,"Latón","Ornamentos, juego de 12","navidad","ornamentos",240,["oro","crudo"],"p-nav-4",
  {mat:"Latón",place:"Sala",style:"Navidad",lead:"Entrega inmediata",esp:["navidad"],
   dims:[["Diámetro","8 cm"],["Unidades","12 por caja"]],
   desc:"Doce esferas de acabado latón envejecido, mate y brillante mezclados. Se ven bien en árbol nevado y en guirnalda.",
   matx:"Esfera de vidrio con baño metalizado. Cinta de yute para colgar.",
   care:"Guardar en la caja original con separadores."}),
 P(33,"Cálida","Luces de 10 m","navidad","luces",180,["oro"],"p-nav-2",
  {mat:"Fibra",place:"Terraza",style:"Navidad",lead:"Entrega inmediata",esp:["navidad"],
   dims:[["Largo","10 m"],["Luces","100 LED"],["Uso","Interior y exterior techado"]],
   desc:"Guirnalda de luces LED cálidas de 10 m con ocho modos. La luz cálida es la que hace que un árbol se vea caro; la fría lo abarata.",
   matx:"Cable verde con LED de 2700 K. Transformador y control incluidos.",
   care:"No usar a la intemperie sin techo. Enrollar en el carrete original."}),

 /* --- piezas únicas --- */
 P(25,"Consola de autor","Ejemplar único de Casacor 2025","decoracion","objetos",6800,["madera","oro"],"p-consola-2",
  {uni:true,mat:"Cedro",place:"Recibidor",style:"Pieza única",lead:"5 días hábiles",stock:"low",
   gal:["p-consola-1","p-objeto-1"],
   dims:[["Largo","150 cm"],["Fondo","42 cm"],["Alto","82 cm"],["Peso","54 kg"]],
   story:"Esta consola se diseñó para el ambiente que el estudio montó en Casacor 2025 y nunca entró a producción. Se hizo una sola, con la madera que había, para que ocupara exactamente los 150 cm de pared que tenía ese espacio.",
   prov:"Diseñada y fabricada por Giandeco Studio Design para Casacor 2025, Lima. Ejemplar único, no numerado. Estuvo en exhibición seis semanas y conserva marcas de uso mínimas en la repisa inferior, documentadas en el certificado.",
   matx:"Cedro nacional macizo con acabado al aceite. Tiradores de latón torneados a medida.",
   care:"Retocar con aceite duro una vez al año."}),
 P(26,"Espejo Barranco","Marco de casona restaurado","decoracion","espejos",4200,["oro","madera"],"p-espejo-2",
  {uni:true,mat:"Madera dorada",place:"Recibidor",style:"Pieza única",lead:"5 días hábiles",stock:"low",
   gal:["p-espejo-1"],
   dims:[["Alto","145 cm"],["Ancho","88 cm"],["Profundidad","7 cm"],["Peso","22 kg"]],
   story:"Marco de una casona de Barranco de principios del siglo pasado, rescatado de una demolición en 2024. Llegó al taller con el dorado saltado y la luna partida.",
   prov:"Marco original de madera tallada y dorada al agua, procedencia Barranco, Lima. Restaurado en el taller del estudio en 2025: consolidación de la talla, reposición de dorado solo en las zonas perdidas y luna nueva de 6 mm. Se conservan las marcas de la talla original.",
   matx:"Madera tallada con dorado al agua sobre bol rojo. Luna nueva biselada de 6 mm.",
   care:"No tocar el dorado con las manos: el sudor lo levanta. Solo plumero suave."})
];

/* Asientos y muebles eran dos categorías separadas. El negocio los trabaja
   como una sola línea —la del taller— así que se unifican al cargar y no hay
   que tocar las 60 fichas de producto. */
var FAMILIA = {
  sofas:"asientos", sillones:"asientos", sillas:"asientos",
  bancos:"asientos", barra:"asientos", tumbonas:"asientos",
  centro:"mesas", comedor:"mesas",
  consolas:"guardado", comodas:"guardado", noche:"guardado", libreros:"guardado"
};

PRODUCTS.forEach(function(p){
  if(p.cat==="asientos" || p.cat==="muebles"){
    p.cat  = "mueble";
    p.tipo = p.sub;                       /* el tipo exacto, por si vuelve a hacer falta */
    p.sub  = FAMILIA[p.sub] || p.sub;     /* tres familias: se navega mejor con pocas */
  }
});

/* La mesa puesta no es una categoría: es un ambiente que se arma con la
   vajilla, los jarrones, los objetos y el textil que ya están en catálogo.
   Se ata aquí y no ficha por ficha, para que al entrar una pieza nueva de
   esas familias caiga sola en el ambiente. */
PRODUCTS.forEach(function(p){
  if(["mesa","jarrones","objetos","textiles"].indexOf(p.sub) >= 0 &&
     p.esp.indexOf("mesa") < 0){ p.esp.push("mesa"); }
});

var byId = {};
PRODUCTS.forEach(function(p){ byId[p.id] = p; });

/* ---------- las cinco líneas del estudio -------------------------------- */

var LINEAS = [
  {n:"01", slug:"arquitectura", t:"Arquitectura", img:"ser-arquitectura",
   p:"Anteproyecto, planos de distribución y dirección de obra. El estudio entra antes de que se mueva el primer ladrillo, que es cuando las decisiones todavía son baratas.",
   li:["Levantamiento y pliego de necesidades","Planos de distribución y detalle","Coordinación de especialidades","Supervisión hasta la entrega"]},
  {n:"02", slug:"interior", t:"Diseño interior", img:"ser-interior",
   p:"Distribución, luz, materiales y mobiliario pensados como un solo sistema. No es escoger un sofá: es decidir por dónde camina la gente y desde dónde entra la luz.",
   li:["Concepto y paleta de materiales","Plano de iluminación","Selección de mobiliario y textiles","Dos rondas de ajuste antes de aprobar"]},
  {n:"03", slug:"decoracion", t:"Decoración", img:"ser-decoracion",
   p:"La capa que se ve y que nadie sabe explicar. Objetos, textiles, mesa puesta y campañas de temporada, montadas por el mismo equipo que hace las vitrinas.",
   li:["Styling de ambientes","Mesa puesta y vajilla","Campaña de temporada, montaje y desmontaje","Guardado del material en enero"]},
  {n:"04", slug:"visual", t:"Visual merchandising", img:"ser-visual",
   p:"La línea con más recorrido del estudio: vitrinas, islas de marca, layout de sala y campañas replicadas en varios locales a la vez. Se ha trabajado a escala de cadena.",
   li:["Diagnóstico de sala y recorrido de compra","Diseño de vitrina, isla y exhibidor","Manual de implantación para replicar","Acompañamiento en el montaje"]},
  {n:"05", slug:"mueble", t:"Mueblería", img:"ser-mueble",
   p:"Taller propio. Del plano de despiece a la pieza instalada, sin tercerizar el control. Es lo que permite que un exhibidor de tienda y un mueble de casa salgan igual de bien.",
   li:["Diseño y plano de despiece","Fabricación en taller propio","Prototipo antes de la serie","Instalación y postventa"]}
];

/* ---------- nuestro universo --------------------------------------------
   Capítulos narrativos. El titular va en dos registros: una línea corta en
   cursiva y una palabra grande en versalitas debajo. La imagen alterna de
   lado para que la lectura tenga pulso.
   ------------------------------------------------------------------------ */

var UNIVERSO = [
  {sobre:"Una casa", titulo:"De oficio", img:"blog-2",
   txt:["Giandeco no empezó en un escritorio. Empezó en obra, midiendo paredes que no estaban a escuadra y resolviendo con lo que había. Esa manera de trabajar no se fue nunca: el estudio sigue entrando a los proyectos por donde se ensucian las manos.",
        "De ahí viene lo que hoy lo distingue. Un plano se dibuja rápido; hacer que ese plano exista en un departamento de Lima, con sus plazos y sus proveedores, es otro oficio. El estudio hace los dos."]},

  {sobre:"Una mirada", titulo:"Propia", img:"uni-mirada",
   txt:["Neutros cálidos, madera que envejece bien, latón que toma pátina. La paleta del estudio no persigue la temporada: persigue que el espacio siga funcionando dentro de diez años, cuando la temporada ya pasó.",
        "No se trata de que todo combine. Se trata de que nada grite. Un ambiente resuelto se reconoce porque no se nota el esfuerzo, y esa discreción es lo más difícil de conseguir."]},

  {sobre:"Un taller", titulo:"Propio", img:"uni-taller",
   txt:["El estudio fabrica. Tiene taller, plano de despiece y prototipo antes de la serie. Por eso un exhibidor de tienda y un mueble de casa salen igual de bien: los hace la misma gente, con el mismo control.",
        "Tercerizar la fabricación significa esperar tres semanas por una corrección. Con taller propio se corrige en dos días, y por eso los plazos de campaña se cumplen."]},

  {sobre:"Una manera", titulo:"De trabajar", img:"pr-plano-1",
   txt:["Gian dirige cada proyecto. No hay un ejecutivo de cuenta traduciendo entre el cliente y quien decide: el que escucha en la primera reunión es el mismo que firma el plano y el que aparece en obra.",
        "El estudio trabaja con alcance escrito. Antes de empezar, el cliente sabe qué se hace, qué no se hace y quién paga cada cosa. Eso evita casi todos los problemas que aparecen después."]}
];

/* ---------- proyectos ----------------------------------------------------
   Fotografías reales del estudio. Los nombres de cliente, años y alcances
   están puestos como ejemplo para la maqueta: Gian debe confirmarlos y
   autorizar la mención de cada marca antes de publicar.
   ------------------------------------------------------------------------ */

var LINEAS_PR = ["Retail","Visual merchandising","Hotelería","Eventos","Residencial"];

var PROYECTOS = [

 {slug:"figuritas-barrio", mundo:"retail", t:"Figuritas del Barrio", sub:"Tienda deportiva de barrio",
  linea:"Retail", anio:"2025", lugar:"Lima", cover:"fig-1",
  gal:["fig-1","fig-2","fig-3","fig-4","fig-5"],
  datos:[["Línea","Retail"],["Alcance","Layout de sala, exhibición y frente de tienda"],["Rubro","Deportivo"],["Año","2025"]],
  txt:["Una tienda de barrio compite con la vereda, no con el centro comercial. El encargo fue que se entendiera qué se vende desde afuera y que adentro se pudiera recorrer sin preguntar.",
       "Se subió el producto estrella a un podio con césped sintético en el centro de la sala y se ordenó la pared por altura de alcance. La camiseta va al nivel del ojo; lo que se compra por impulso, a la altura de la mano."]},

 {slug:"walon-35", mundo:"retail", t:"Walon 35 Años", sub:"Montaje del aniversario de la marca",
  linea:"Eventos", anio:"2025", lugar:"Lima", cover:"w35-1",
  gal:["w35-1","w35-2","w35-3","w35-4","w35-5"],
  datos:[["Línea","Eventos"],["Alcance","Escenografía, mesas y iluminación"],["Cliente","Walon"],["Año","2025"]],
  txt:["Treinta y cinco años de una marca se celebran una sola noche. El salón entró vacío por la mañana y tenía que estar montado, iluminado y probado antes de que llegara el primer invitado.",
       "Se trabajó con drapeado de tela en toda la altura del muro, mesas vestidas en la paleta de la marca e iluminación de color que cambia entre el cóctel y la cena. Todo se desmontó esa misma madrugada."]},

 {slug:"raices-hogar", mundo:"retail", t:"Raíces y Hogar", sub:"Tienda de decoración y textil",
  linea:"Visual merchandising", anio:"2025", lugar:"Lima", cover:"raices-1",
  gal:["raices-1","raices-2","raices-3","raices-4","raices-5"],
  datos:[["Línea","Visual merchandising"],["Alcance","Implantación de sala y vitrina"],["Rubro","Decoración y textil"],["Año","2025"]],
  txt:["Una tienda de decoración tiene un problema propio: todo lo que vende es bonito, y cuando todo compite el ojo no se detiene en nada.",
       "Se agrupó por color en vez de por tipo de producto, se dejaron respiros vacíos entre familias y se reservó la altura del ojo para la temporada vigente. El resto del inventario bajó de nivel sin salir de sala."]},

 {slug:"hotel-union", mundo:"retail", t:"Hotel Unión", sub:"Comedor y mesa puesta",
  linea:"Hotelería", anio:"2025", lugar:"Lima", cover:"union-1",
  gal:["union-1","union-2","union-3","union-4","union-5","union-6"],
  datos:[["Línea","Hotelería"],["Alcance","Comedor, mantelería y mesa puesta"],["Cubiertos","Servicio de desayuno y cena"],["Año","2025"]],
  txt:["El comedor de un hotel se monta dos veces al día y lo ve todo el que se aloja. Tenía que resolverse con material que aguante el uso diario y siga viéndose cuidado en la última mesa del turno.",
       "Se definió una mantelería de dos tonos que se alterna por servicio, una vajilla que no se descataloga y una disposición de mesa que el personal arma igual sin necesidad de plantilla."]},

 {slug:"massimo-cafe", mundo:"retail", t:"Massimo Café", sub:"Salón de autor",
  linea:"Hotelería", anio:"2025", lugar:"Lima", cover:"massimo-1",
  gal:["massimo-1","massimo-2","massimo-3","massimo-4","massimo-5"],
  datos:[["Línea","Hotelería"],["Alcance","Interiorismo de salón y muro de arte"],["Aforo","Salón principal"],["Año","2025"]],
  txt:["El café quería un salón que se recordara y que se fotografiara solo. Se apostó por un muro rojo cubierto de cuadros de piso a techo, sin dejar aire entre marcos.",
       "La saturación es deliberada: es la única pared del local que grita, y por eso funciona. El resto del salón se mantuvo en madera y luz cálida baja para que el muro sea siempre el fondo, nunca el competidor."]},

 {slug:"convivir-arte", mundo:"hogar", t:"Convivir con el Arte", sub:"Sala principal",
  linea:"Residencial", anio:"2025", lugar:"Lima", cover:"arte-1",
  gal:["arte-1","arte-2","arte-3","arte-4","arte-5","arte-6","arte-7","arte-8"],
  datos:[["Línea","Residencial"],["Alcance","Diseño interior de sala y comedor"],["Ambientes","Sala principal"],["Año","2025"]],
  txt:["La casa tenía obra de arte antes de tener proyecto. La pregunta no era qué colgar, sino cómo amueblar sin competir con lo que ya estaba en las paredes.",
       "Se bajó todo el mobiliario a tonos neutros y alturas bajas, y se llevó el color al textil y al techo. La cortina y la luz de perímetro enmarcan; el sofá y las butacas se quedan callados."]},

 {slug:"casa-grande", mundo:"hogar", t:"Casa Grande", sub:"Sala, comedor y habitación",
  linea:"Residencial", anio:"2025", lugar:"Lima", cover:"cg-sala-1",
  gal:["cg-sala-1","cg-sala-2","cg-com-1","cg-com-2","cg-hab-1","cg-hab-2","cg-sala-3","cg-com-3","cg-hab-3"],
  datos:[["Línea","Residencial"],["Alcance","Ambientación completa de tres ambientes"],["Ambientes","Sala, sala comedor y habitación"],["Año","2025"]],
  txt:["Tres ambientes montados como se viven: la sala para recibir, el comedor para el diario y la habitación para descansar. Cada uno se resolvió entero, con su mobiliario, su textil y su decoración.",
       "Los tres comparten familia de tonos y se pueden llevar por separado. Es el encargo que mejor explica cómo trabaja el estudio: no se vende un mueble, se entrega un ambiente resuelto."]}

];

/* ---------- relato ampliado de cada proyecto -----------------------------
   La ficha de proyecto necesita contar tres cosas antes de enseñar fotos:
   qué pedía el cliente, de dónde salió la idea y qué se hizo. Va aparte
   para no engordar el array de arriba, y se funde con él al cargar.
   ------------------------------------------------------------------------ */

var RELATOS = {

 "figuritas-barrio":{
  reto:"Una tienda de barrio con vereda estrecha y mucha competencia alrededor. Había que decidir qué se ve desde afuera y qué se recorre adentro, sin ampliar ni un metro.",
  inspira:"El podio de premiación. Subir el producto, dejar el piso limpio y que la pieza se lea desde los cuatro lados del pasillo, como una escultura en una plaza.",
  cita:"El comprador decide si entra en dos segundos, y decide desde la vereda.",
  mats:["Césped sintético","Melamina","Maniquí articulado","Gráfica retroiluminada"]},

 "walon-35":{
  reto:"Un salón vacío por la mañana y un aniversario de marca esa misma noche. Montaje, prueba de luces y desmontaje de madrugada.",
  inspira:"El telón de un teatro antes de que suba. Tela en toda la altura, luz de color y las mesas esperando en penumbra.",
  cita:"Una fecha así no admite segunda oportunidad: o está montado a las siete, o no está.",
  mats:["Drapeado de tela","Iluminación RGB","Mantelería a medida","Cristalería"]},

 "raices-hogar":{
  reto:"Una tienda donde todo el inventario es atractivo. Cuando todo compite, el ojo no se detiene en nada y la venta se cae.",
  inspira:"Las estanterías de una librería antigua: agrupadas por familia, con huecos vacíos que dejan respirar y una sola mesa central con lo nuevo.",
  cita:"Agrupar por color y no por producto: el ojo entiende el color antes que la categoría.",
  mats:["Repisa de madera","Textil de temporada","Iluminación cálida dirigida","Mesa central"]},

 "hotel-union":{
  reto:"Un comedor que se monta dos veces al día, todos los días, y que ve todo el que se aloja. Tenía que resistir el uso y seguir viéndose cuidado en la última mesa del turno.",
  inspira:"El servicio de un comedor familiar peruano: mantel doble, vajilla que no se descataloga y un centro sencillo que se repone sin costo.",
  cita:"Lo que el personal no puede repetir igual todos los días, no sirve por bonito que sea.",
  mats:["Mantelería de dos tonos","Vajilla de reposición","Cristalería","Madera y textil"]},

 "massimo-cafe":{
  reto:"El salón tenía que recordarse y fotografiarse solo, con presupuesto de café de barrio y no de hotel.",
  inspira:"Los salones de coleccionista del siglo XIX, con los cuadros colgados de piso a techo y sin aire entre marcos. La saturación como decisión, no como descuido.",
  cita:"Una sola pared grita. Si gritan todas, no se oye ninguna.",
  mats:["Muro pintado en rojo","Marcos recuperados","Madera","Luz cálida baja"]},

 "convivir-arte":{
  reto:"La casa tenía obra de arte antes de tener proyecto. Amueblar sin competir con lo que ya estaba colgado en las paredes.",
  inspira:"Una sala de museo: paredes que mandan, asientos bajos y neutros, y la luz puesta en la obra y no en el mobiliario.",
  cita:"Cuando el arte ya está, el mobiliario se calla.",
  mats:["Textil en tonos neutros","Cortina de doble caída","Luz de perímetro","Mesa de centro baja"]},

 "casa-grande":{
  reto:"Montar tres ambientes que se lean como una misma casa y que, aun así, se puedan llevar por separado.",
  inspira:"Las casas de exposición de los grandes almacenes europeos: se entra, se recorre y se compra lo que se está viendo, sin imaginar nada.",
  cita:"No se vende un mueble: se entrega un ambiente resuelto.",
  mats:["Tapicería en familia de tonos","Madera","Alfombra","Obra enmarcada"]}

};/* ---------- compra el espacio ------------------------------------------- */

var ESPACIOS = [
 {slug:"cg-sala", name:"Casa Grande · Sala", img:"cg-sala-1",
  text:"Sofá en azul profundo, butacas crudas y mesa de centro baja. Un salón para recibir, con la obra colgada a la altura del que está sentado."},
 {slug:"cg-comedor", name:"Casa Grande · Sala comedor", img:"cg-com-1",
  text:"Modular gris, cojines de color y planta alta en la esquina. El ambiente del diario, resuelto para que aguante el uso."},
 {slug:"cg-hab", name:"Casa Grande · Habitación", img:"cg-hab-1",
  text:"Cabecero tapizado, ropa de cama en estampado suave y mesas de noche a juego. Todo lo que hace falta para dormir bien y nada más."},
 {slug:"bosque", name:"Animales en el Bosque", img:"bosque-1",
  text:"Terraza montada de noche: vegetación alta, luz colgante cálida y asientos bajos. El ambiente exterior que más se pide y el que peor suele resolverse."},
 {slug:"mesa", name:"Mesa puesta", img:"mesa-1",
  text:"Vajilla, cristalería, mantel y centro floral. La mesa completa, montada por el mismo equipo que hace las vitrinas."},
 {slug:"navidad", name:"Navidad Atemporal", img:"navid-1",
  text:"Árbol, lazo, corona y mesa de temporada. Se monta en diciembre y se desmonta y guarda rotulado la primera semana de enero."}
];

/* ---------- puntos sobre la fotografía -----------------------------------
   Cada ambiente lleva marcadas las piezas que se pueden comprar. Las
   coordenadas van en porcentaje del ancho y del alto de la propia foto,
   así que el contenedor tiene que respetar la proporción de la imagen:
   si se recorta, los puntos dejan de caer donde deben.
   ------------------------------------------------------------------------ */

var PUNTOS = {

 /* Casa Grande · Sala — el sofá azul manda la escena */
 "cg-sala-1":[
   {x:37, y:55, id:1},    /* sofá azul de tres cuerpos */
   {x:25, y:72, id:3},    /* butaca crema en primer plano */
   {x:55, y:70, id:9},    /* mesa de centro redonda */
   {x:74, y:68, id:6},    /* puf gris junto al ventanal */
   {x:13, y:48, id:12}    /* consola de la pared izquierda */
 ],

 /* Casa Grande · Sala comedor */
 "cg-com-1":[
   {x:20, y:62, id:2},    /* modular gris */
   {x:61, y:68, id:5},    /* otomana tapizada que hace de mesa */
   {x:46, y:78, id:10},   /* mesa auxiliar redonda */
   {x:84, y:63, id:12},   /* consola negra de la derecha */
   {x:70, y:52, id:6}     /* banqueta amarilla del fondo */
 ],

 /* Casa Grande · Habitación */
 "cg-hab-1":[
   {x:63, y:68, id:14},   /* mesa de noche */
   {x:36, y:68, id:5},    /* banco a los pies de la cama */
   {x:86, y:72, id:3},    /* butaca del rincón */
   {x:70, y:62, id:13}    /* cómoda de la pared */
 ],

 /* Animales en el Bosque — terraza montada de noche, vista cenital */
 "bosque-1":[
   {x:24, y:64, id:1},    /* sofá largo de la izquierda */
   {x:48, y:50, id:2},    /* sofá del fondo */
   {x:52, y:64, id:9},    /* mesa de centro de madera */
   {x:44, y:85, id:3},    /* butacas del primer plano */
   {x:55, y:33, id:18}    /* colgante de esferas */
 ],

 /* Mesa puesta */
 "mesa-1":[
   {x:79, y:63, id:37},   /* vajilla del cubierto derecho */
   {x:52, y:48, id:19},   /* centro de mesa */
   {x:32, y:42, id:20},   /* jarrón de la consola del fondo */
   {x:9,  y:41, id:22}    /* bandeja de latón */
 ],

 /* Navidad Atemporal — la campaña viva */
 "navid-1":[
   {x:33, y:48, id:27},   /* árbol de 2.10 m */
   {x:40, y:58, id:30},   /* guirnalda verde */
   {x:21, y:68, id:32},   /* ornamentos */
   {x:44, y:72, id:33},   /* luces */
   {x:80, y:53, id:31}    /* mesa navideña del fondo */
 ]

};

/* ---------- blog --------------------------------------------------------- */

var NOTAS = [
 {k:"Visual merchandising", t:"Cómo se piensa una vitrina que sí vende", mundo:"retail", r:"6 min", img:"blog-4",
  d:"El recorrido del ojo, la jerarquía del producto y por qué la mayoría de vitrinas en Lima se arman al revés."},
 {k:"Proceso", t:"Qué preguntar antes de remodelar", mundo:"hogar", r:"7 min", img:"blog-1",
  d:"Las ocho preguntas que hacemos en la primera visita, y lo que cada respuesta cambia en el presupuesto."},
 {k:"Obra", t:"Travertino en Lima: lo que nadie le cuenta", mundo:"hogar", r:"5 min", img:"blog-2",
  d:"Es poroso, la garúa lo marca y el sellado no es opcional. Aun así lo seguimos usando, y explicamos por qué."},
 {k:"Interiorismo", t:"El error de comprar los muebles primero", mundo:"hogar", r:"5 min", img:"blog-6",
  d:"Casi todos empiezan por el sofá. Explicamos por qué conviene empezar por la luz y la circulación."},
 {k:"Retail", t:"Una campaña de temporada en catorce días", mundo:"retail", r:"8 min", img:"blog-5",
  d:"Cómo se planifica, produce y monta una campaña navideña completa para una sala de ventas."},
 {k:"Materiales", t:"Del render a la obra: por qué casi nunca coinciden", mundo:"retail", r:"6 min", img:"blog-3",
  d:"Qué se puede prometer con una imagen y qué depende del enchape que llegue esa semana a la ferretería."}
];

/* ---------- campañas de portada ------------------------------------------
   Una por línea de negocio, en el orden en que el estudio quiere venderlas.
   Titular corto: en portada, cada palabra de más resta.
   ------------------------------------------------------------------------ */

var CAMPS = [
 {img:"navid-1", eye:"Campaña de temporada", t:"La Navidad, montada",
  p:"Árbol, vitrina, mesa y luces. Montaje en diciembre, desmontaje y guardado en enero.",
  cta:"Ver la campaña", go:"cat:navidad"},
 {img:"fig-1", eye:"Retail", t:"El espacio es lo primero que vende",
  p:"Vitrinas, islas de marca y campañas de temporada para cadenas de tienda.",
  cta:"Ver Retail", go:"retail"},
 {img:"arte-1", eye:"Hogar", t:"Su casa, resuelta de una vez",
  p:"Diseño interior integral. Gian dirige cada encargo, de la medición a la entrega.",
  cta:"Ver Hogar", go:"hogar"},
 {img:"cg-sala-1", eye:"Mueblería", t:"Hecho en taller propio",
  p:"Del plano de despiece a la pieza instalada, sin tercerizar el control.",
  cta:"Ver la mueblería", go:"cat:mueble"}
];


/* ---------- los tres servicios ------------------------------------------
   Retail y Hogar son las dos páginas de servicio. Comparten estructura para
   que el sitio se lea como un sistema y no como dos landings sueltas:
   promesa, entregables, proceso de tres pasos y llamada a la acción.
   ------------------------------------------------------------------------ */

var SERVICIOS = {

 retail:{
  mundo:"retail",
  marca:"Marca en sala",
  titulo:"Diseño de tiendas",
  hero:"fig-1",
  eyebrow:"Retail y visual merchandising",
  promesa:"Que su tienda se entienda desde la vereda y se recorra sin que nadie explique nada.",
  intro:"Es la línea con más recorrido del estudio. Se ha trabajado a escala de cadena: un criterio que se define una vez y se replica en cada local.",
  cifras:[["+40","locales intervenidos"],["8","marcas atendidas"],["14","días para montar una campaña"]],
  entregables:[
   {n:"01", t:"Diagnóstico de sala", p:"Recorrido de compra, puntos ciegos y qué se ve desde la puerta.", img:"raices-2"},
   {n:"02", t:"Vitrina y fachada", p:"Lo único que el comprador ve antes de decidir si entra.", img:"fig-2"},
   {n:"03", t:"Isla y exhibidor", p:"Mobiliario de exhibición fabricado en taller propio.", img:"fig-4"},
   {n:"04", t:"Campaña de temporada", p:"Producción, montaje, desmontaje y guardado del material.", img:"navid-3"},
   {n:"05", t:"Manual de implantación", p:"Medidas, materiales y secuencia para replicar sin nosotros.", img:"raices-4"}
  ],
  proceso:[
   {n:"01", t:"Visita a la sala", p:"Se mide, se observa cómo camina la gente y qué producto se pierde.", img:"raices-5"},
   {n:"02", t:"Propuesta", p:"Planos, materiales y perspectivas. Usted aprueba antes de que se fabrique nada.", img:"pr-plano-1"},
   {n:"03", t:"Montaje", p:"Fabricación en taller propio e instalación en sala, fuera del horario de atención.", img:"w35-2"}
  ],
  boceto:{foto:"fig-1", pie:"Figuritas del Barrio — del dibujo de implantación a la tienda montada."},

  /* La tabla abre la página: cinco piezas en composición desigual. La primera
     lleva tirador —es la que enseña el mecanismo— y las otras cuatro se abren
     solas al pasar el cursor. Ninguna se repite en el mosaico de más abajo. */
  tabla:["fig-1","raices-1","union-1","massimo-1","w35-1"],

  /* El mosaico va de mayor a menor: la primera pieza manda y las demás la
     acompañan. Cada una empieza dibujada y se revela al pasar el cursor. */
  mosaico:["fig-3","raices-3","union-3","massimo-3","w35-3","raices-5"],
  cta:{t:"Hablemos de su sala", p:"La primera visita no cuesta y sirve para saber si el encargo tiene sentido para las dos partes.", b:"Agendar una visita"}
 },

 hogar:{
  mundo:"hogar",
  marca:"Casa resuelta",
  titulo:"Diseño de interiores",
  hero:"arte-1",
  eyebrow:"Hogar",
  promesa:"Una casa que funciona todos los días, no solo el día de la foto.",
  intro:"Sala, dormitorio, comedor o la vivienda completa. El estudio entra con el plano, decide la luz y la circulación, y se queda hasta la mudanza.",
  cifras:[["96 m²","proyecto integral típico"],["2","rondas de ajuste antes de aprobar"],["1","interlocutor: Gian"]],
  entregables:[
   {n:"01", t:"Distribución y circulación", p:"Por dónde camina la gente y qué pared puede moverse.", img:"cg-sala-2"},
   {n:"02", t:"Plano de iluminación", p:"La decisión que más cambia un ambiente y la que casi nadie toma a tiempo.", img:"bosque-2"},
   {n:"03", t:"Paleta de materiales", p:"Neutros cálidos, madera que envejece bien, latón que toma pátina.", img:"arte-3"},
   {n:"04", t:"Mueblería a medida", p:"Lo que no existe en tienda se dibuja y se fabrica en el taller.", img:"uni-taller"},
   {n:"05", t:"Montaje y entrega", p:"Se entrega instalado, con la casa lista para vivirse.", img:"cg-hab-2"}
  ],
  proceso:[
   {n:"01", t:"Primera visita", p:"Medición, uso real y presupuesto. De ahí sale el pliego de necesidades.", img:"blog-1"},
   {n:"02", t:"Proyecto", p:"Planos, materiales, iluminación y selección de mobiliario en un solo expediente.", img:"pr-plano-3"},
   {n:"03", t:"Obra y entrega", p:"Dirección de obra, taller propio y coordinación de proveedores.", img:"cg-com-2"}
  ],
  boceto:{foto:"arte-1", pie:"Convivir con el Arte — del dibujo a mano a la sala entregada."},
  tabla:["arte-1","cg-sala-1","cg-hab-1","cg-com-1","bosque-1"],
  mosaico:["arte-4","cg-sala-3","cg-hab-4","cg-com-3","bosque-4","mesa-1"],
  cta:{t:"Cuéntenos de su espacio", p:"Metraje, distrito y en qué plazo lo necesita. Gian responde dentro de 24 horas hábiles.", b:"Agendar una asesoría"}
 }
};


/* ---------- quiénes somos -----------------------------------------------
   La página es sobre Gian: de dónde sale el estudio y quién lo ejecuta hoy.
   Las fotos del equipo están pendientes; mientras tanto se usa una ficha
   con monograma, que se ve intencional en lugar de rota.
   ------------------------------------------------------------------------ */

var HISTORIA = [
 {a:"El origen", t:"Empezó en obra",
  p:"Giandeco no nació en un escritorio. Nació midiendo paredes que no estaban a escuadra y resolviendo con lo que había.",
  img:"uni-taller"},
 {a:"La mirada", t:"Neutros que duran",
  p:"La paleta del estudio no persigue la temporada. Persigue que el espacio siga funcionando dentro de diez años.",
  img:"uni-mirada"},
 {a:"El taller", t:"Fabricación propia",
  p:"Plano de despiece, prototipo y serie. Por eso un exhibidor de tienda y un mueble de casa salen igual de bien.",
  img:"pr-plano-1"}
];

var EQUIPO = [
 {ini:"G", n:"Gian", rol:"Fundador y director de proyectos",
  p:"Dirige cada encargo de principio a fin. El que escucha en la primera reunión es el mismo que firma el plano y el que aparece en obra.",
  img:"", destacado:true},
 {ini:"M", n:"Martha", rol:"Diseñadora de interiores",
  p:"Concepto, paleta de materiales y selección de mobiliario. Traduce el pliego de necesidades en un ambiente que se sostiene.",
  img:""},
 {ini:"L", n:"Lucía", rol:"Arquitecta",
  p:"Planos, distribución y coordinación de especialidades. Se encarga de que lo dibujado se pueda construir.",
  img:""}
];

var CIFRAS_ESTUDIO = [
 ["+40","locales intervenidos"],
 ["+60","proyectos entregados"],
 ["8","marcas atendidas"],
 ["1","taller propio"]
];


/* ---------- la cinta del encabezado -------------------------------------
   Tres frases que se turnan. Una línea con las tres seguidas se lee como
   letra pequeña de contrato; de una en una, cada frase se lee de verdad.
   ------------------------------------------------------------------------ */

var AVISOS = [
  "Campaña de Navidad abierta",
  "Estudio de diseño en Lima",
  "Av. Arenales, Lince",
  "Asesoría con cita previa"
];


/* ---------- redes ---------------------------------------------------------
   Los iconos van dibujados con el mismo trazo que el resto del sitio —línea
   de 1.3, remates redondos— en vez de pegar los logotipos oficiales, que
   llegan cada uno con su peso y su relleno y ensucian el pie.

   Las direcciones están pendientes: hay que pedírselas al estudio.
   ------------------------------------------------------------------------ */

var REDES = [
  {id:"instagram", nombre:"Instagram", url:"#"},
  {id:"facebook",  nombre:"Facebook",  url:"#"},
  {id:"tiktok",    nombre:"TikTok",    url:"#"}
];

var ICONO_RED = {
  instagram:'<rect x="3.6" y="3.6" width="16.8" height="16.8" rx="4.9"/>'+
            '<circle cx="12" cy="12" r="4.05"/>'+
            '<circle cx="17.15" cy="6.85" r="1.05" fill="currentColor" stroke="none"/>',
  facebook: '<circle cx="12" cy="12" r="8.7"/>'+
            '<path d="M14.35 8.35h-1.1c-.97 0-1.63.63-1.63 1.62v1.55m-1.72 0h4.3m-2.58 0v8.1"/>',
  tiktok:   '<path d="M14.55 3.3v10.85a3.62 3.62 0 1 1-3.62-3.62c.32 0 .63.04.93.12"/>'+
            '<path d="M14.55 3.3c.32 2.42 2.06 4.2 4.45 4.42"/>'
};


/* ---------- pares boceto / obra ------------------------------------------
   Fotografías que ya tienen su versión a lápiz en img/sk-<nombre>.jpg,
   generada con hacer-bocetos.py. El componente solo se dibuja si el par
   existe: nunca se enseña un marco a medias.

   Estos dibujos salen de la propia foto y son material de trabajo. Cuando
   lleguen los bocetos a mano del estudio, se reemplaza el archivo sk-* con
   el mismo nombre y el sitio no se entera.
   ------------------------------------------------------------------------ */

var BOCETOS = [
  /* retail */
  "fig-1","fig-2","fig-3","fig-4",
  "raices-1","raices-2","raices-3","raices-4","raices-5",
  "union-1","union-3","massimo-1","massimo-3",
  "w35-1","w35-2","w35-3",
  /* hogar y ambientes */
  "arte-1","arte-3","arte-4",
  "cg-sala-1","cg-sala-2","cg-sala-3",
  "cg-com-1","cg-com-2","cg-com-3",
  "cg-hab-1","cg-hab-2","cg-hab-4",
  "bosque-1","bosque-2","bosque-4",
  "mesa-1","navid-1","navid-3",
  /* planos del estudio */
  "pr-plano-1"
];

function tieneBoceto(k){ return BOCETOS.indexOf(k) >= 0; }

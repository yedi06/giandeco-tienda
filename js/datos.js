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

/* ---------- taxonomía del catálogo -------------------------------------- */

var TAX = [
  {slug:"asientos", name:"Asientos", img:"cat-asientos", subs:[
    {s:"sofas", name:"Sofás"}, {s:"sillones", name:"Sillones"}, {s:"tumbonas", name:"Tumbonas"},
    {s:"bancos", name:"Bancos y pufs"}, {s:"sillas", name:"Sillas"}, {s:"barra", name:"Sillas de bar"}]},
  {slug:"muebles", name:"Muebles", img:"cat-muebles", subs:[
    {s:"centro", name:"Mesas de centro"}, {s:"comedor", name:"Mesas de comedor"}, {s:"consolas", name:"Consolas"},
    {s:"comodas", name:"Cómodas"}, {s:"noche", name:"Mesas de noche"}, {s:"libreros", name:"Libreros"}]},
  {slug:"iluminacion", name:"Iluminación", img:"cat-iluminacion", subs:[
    {s:"mesa", name:"De mesa"}, {s:"pie", name:"De pie"}, {s:"colgante", name:"Colgantes"}]},
  {slug:"decoracion", name:"Decoración", img:"cat-decoracion", subs:[
    {s:"espejos", name:"Espejos"}, {s:"objetos", name:"Objetos"}, {s:"jarrones", name:"Jarrones"},
    {s:"textiles", name:"Textiles"}]},
  {slug:"papel", name:"Papel mural", img:"cat-papel", subs:[
    {s:"panoramico", name:"Panorámicos"}, {s:"repetido", name:"De repetición"}]},
  {slug:"navidad", name:"Navidad", img:"cat-navidad", subs:[
    {s:"arboles", name:"Árboles"}, {s:"coronas", name:"Coronas y guirnaldas"}, {s:"mesa", name:"Mesa navideña"},
    {s:"ornamentos", name:"Ornamentos"}, {s:"luces", name:"Luces"}]}
];

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
  {mat:"Bouclé",place:"Sala",style:"Contemporáneo",lead:"6 a 8 semanas",esp:["sala"],
   gal:["p-sofa-1","p-sofa-2","p-sofa-4"],
   dims:[["Ancho","230 cm"],["Fondo","95 cm"],["Alto","78 cm"],["Alto de asiento","44 cm"],["Peso","62 kg"]],
   desc:"Tres cuerpos de líneas bajas y brazo ancho, pensado para sentarse de verdad y no solo para mirar. El asiento combina espuma de alta densidad con una envoltura de plumón: cede al sentarse y recupera la forma.",
   matx:"Tapiz bouclé de algodón y poliéster, desenfundable. Estructura de madera de tornillo secada al horno. Patas de roble macizo con acabado al aceite.",
   care:"Aspirar con boquilla suave cada dos semanas. Las manchas se levantan con paño húmedo y jabón neutro, del borde hacia el centro. No usar blanqueadores."}),
 P(2,"Miraflores","Sofá de 2 cuerpos","asientos","sofas",3890,["crudo","arena"],"p-sofa-2",
  {mat:"Lino",place:"Sala",lead:"6 semanas",esp:["sala"],gal:["p-sofa-1","p-sofa-4"],
   dims:[["Ancho","178 cm"],["Fondo","92 cm"],["Alto","76 cm"],["Peso","48 kg"]],
   desc:"La versión de dos cuerpos del Barranco, para departamentos donde el metraje manda. Mismo asiento, mismo brazo, 52 cm menos de ancho.",
   matx:"Lino lavado 100 % natural, desenfundable. Estructura de madera de tornillo.",
   care:"Lavado en seco de las fundas. El lino se arruga: es parte del material, no un defecto."}),
 P(3,"Chorrillos","Sillón de lectura","asientos","sillones",2180,["crudo","verde"],"p-sillon-1",
  {mat:"Lino",place:"Dormitorio",lead:"6 semanas",esp:["sala","dormitorio"],gal:["p-sillon-2"],
   dims:[["Ancho","78 cm"],["Fondo","82 cm"],["Alto","74 cm"],["Alto de asiento","42 cm"]],
   desc:"Sillón de respaldo inclinado, pensado para leer una hora sin cambiar de postura. Incluye cojín lumbar del mismo tejido.",
   matx:"Lino crudo lavado sobre estructura de roble macizo.",
   care:"Aspirado suave. Rotar el cojín cada mes para que asiente parejo."}),
 P(4,"Paracas","Tumbona de exterior","asientos","tumbonas",1980,["arena","madera"],"esp-terraza",
  {mat:"Teca",place:"Terraza",style:"Contemporáneo",lead:"4 semanas",esp:["terraza"],
   dims:[["Largo","195 cm"],["Ancho","68 cm"],["Alto","36 cm"]],
   desc:"Tumbona de teca con respaldo de cuatro posiciones y ruedas ocultas en las patas traseras. Resiste el verano limeño y la humedad de la garúa.",
   matx:"Teca de plantación certificada, sin tratar. Colchoneta de tejido acrílico solution-dyed.",
   care:"La teca sin tratar toma una pátina gris plata en unos seis meses. Si prefiere el tono miel original, aplicar aceite de teca dos veces al año."}),
 P(5,"Ancón","Banco tapizado","asientos","bancos",890,["crudo","burdeos"],"p-banco-1",
  {mat:"Bouclé",place:"Dormitorio",lead:"3 semanas",esp:["dormitorio"],
   dims:[["Ancho","120 cm"],["Fondo","40 cm"],["Alto","46 cm"]],
   desc:"Banco de pie de cama o de recibidor. Firme para sentarse a ponerse los zapatos, discreto para no estorbar.",
   matx:"Bouclé sobre estructura de madera. Patas de latón macizo.",
   care:"Aspirar. Evitar la exposición directa al sol para que el bouclé no amarillee."}),
 P(6,"Sillar","Puf redondo","asientos","bancos",620,["arena","verde"],"p-sillon-2",
  {mat:"Lino",place:"Sala",lead:"Entrega inmediata",stock:"low",esp:["sala","terraza"],
   dims:[["Diámetro","55 cm"],["Alto","42 cm"]],
   desc:"Puf de relleno firme que funciona como asiento extra o como mesa auxiliar con una bandeja encima.",
   matx:"Funda de lino con cierre invisible. Relleno de fibra de poliéster de alta densidad.",
   care:"Funda lavable en seco."}),
 P(7,"San Isidro","Silla de comedor","asientos","sillas",780,["crudo","negro"],"p-silla-1",
  {mat:"Roble",place:"Comedor",lead:"4 semanas",esp:["comedor"],gal:["p-silla-2"],
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
  {mat:"Travertino",place:"Sala",lead:"3 semanas",esp:["sala"],gal:["p-objeto-2"],
   dims:[["Largo","110 cm"],["Ancho","60 cm"],["Alto","38 cm"],["Peso","78 kg"]],
   desc:"Bloque de travertino romano con el canto irregular pulido a mano. Cada pieza tiene su propio veteado: no hay dos iguales, y por eso la que reciba no será idéntica a la de la foto.",
   matx:"Travertino natural sellado con producto de penetración mate. Base de acero oculta.",
   care:"El travertino es poroso: limpiar los derrames de inmediato, sobre todo vino y cítricos. Resellar cada dos años."}),
 P(10,"Lúcuma","Mesa lateral","muebles","centro",1680,["crudo"],"p-objeto-2",
  {mat:"Travertino",place:"Sala",lead:"3 semanas",esp:["sala"],
   dims:[["Diámetro","40 cm"],["Alto","52 cm"],["Peso","34 kg"]],
   desc:"Cilindro de travertino tallado de un solo bloque. Pesa 34 kg: se instala una vez y no se vuelve a mover.",
   matx:"Travertino natural sellado mate.",
   care:"Igual que la mesa de centro: sellado cada dos años y nada de ácidos."}),
 P(11,"Quinua","Mesa de comedor","muebles","comedor",5200,["madera"],"p-mesa-1",
  {mat:"Roble",place:"Comedor",lead:"8 semanas",esp:["comedor"],gal:["p-mesa-2","p-mesapuesta-2"],
   dims:[["Largo","220 cm"],["Ancho","100 cm"],["Alto","76 cm"],["Comensales","8 a 10"]],
   desc:"Mesa de comedor de tablón macizo con junta viva al centro. Para ocho cómodos, diez apretados.",
   matx:"Roble macizo europeo, acabado al aceite duro.",
   care:"El aceite se retoca en casa: un paño, aceite duro y media hora. Evitar apoyar ollas calientes."}),
 P(12,"Chala","Consola","muebles","consolas",3240,["madera","crudo"],"p-consola-1",
  {mat:"Roble",place:"Recibidor",lead:"5 semanas",esp:["sala"],gal:["p-consola-2"],
   dims:[["Largo","160 cm"],["Fondo","40 cm"],["Alto","80 cm"]],
   desc:"Consola de recibidor con dos cajones de cierre suave y repisa inferior. Cabe detrás de un sofá o contra una pared ciega.",
   matx:"Roble macizo y enchapado de roble sobre MDF hidrófugo. Tiradores de latón.",
   care:"Paño apenas húmedo. Retocar con aceite una vez al año."}),
 P(13,"Pacae","Cómoda de tres cajones","muebles","comodas",3980,["madera","negro"],"p-consola-2",
  {mat:"Roble",place:"Dormitorio",lead:"6 semanas",esp:["dormitorio"],
   dims:[["Ancho","120 cm"],["Fondo","48 cm"],["Alto","82 cm"]],
   desc:"Cómoda de tres cajones amplios con correderas de extracción total. Los cajones llegan hasta el fondo: se usa todo el volumen.",
   matx:"Estructura de roble, cajones con fondo de cedro. Correderas metálicas con freno.",
   care:"No cargar el cajón superior con más de 15 kg."}),
 P(14,"Molle","Mesa de noche","muebles","noche",1120,["madera","crudo"],"p-objeto-3",
  {mat:"Roble",place:"Dormitorio",lead:"4 semanas",esp:["dormitorio"],
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
  {mat:"Cerámica",place:"Sala",lead:"2 semanas",esp:["dormitorio"],gal:["p-lampara-3"],
   dims:[["Diámetro pantalla","32 cm"],["Alto total","58 cm"],["Casquillo","E27"]],
   desc:"Base torneada en cerámica esmaltada mate con pantalla de lino natural. Da luz cálida y difusa, no un foco al ojo.",
   matx:"Cerámica esmaltada mate. Pantalla de lino sobre estructura metálica. Cable textil trenzado de 2 m.",
   care:"Quitar el polvo de la pantalla con cepillo suave. Dimerizable con LED regulable."}),
 P(17,"Cañón","Lámpara de pie","iluminacion","pie",1340,["oro","negro"],"p-lampara-3",
  {mat:"Latón",place:"Sala",lead:"3 semanas",esp:["sala","terraza"],
   dims:[["Diámetro base","30 cm"],["Alto","165 cm"],["Casquillo","E27"]],
   desc:"Lámpara de pie de tubo de latón con pantalla orientable. Para poner al lado del sillón de lectura.",
   matx:"Latón macizo con pátina envejecida. Base contrapesada de acero.",
   care:"Paño seco sobre el latón; la pátina se profundiza con el tiempo."}),
 P(18,"Totora","Colgante de fibra","iluminacion","colgante",1180,["arena"],"p-lampara-2",
  {mat:"Fibra",place:"Comedor",style:"Artesanal",lead:"5 semanas",esp:["comedor"],
   dims:[["Diámetro","55 cm"],["Alto","40 cm"],["Cable","150 cm regulable"]],
   desc:"Pantalla tejida a mano en fibra natural por artesanas de Catacaos. La luz sale filtrada por el tejido y dibuja sombras en el techo.",
   matx:"Fibra vegetal trenzada sobre aro metálico. Rosetón y cable en latón.",
   care:"Aspirar con boquilla de cepillo. No mojar."}),
 P(19,"Lima","Hurricane de vidrio","decoracion","objetos",320,["oro","crudo"],"p-objeto-1",
  {mat:"Vidrio",place:"Sala",lead:"Entrega inmediata",stock:"low",esp:["comedor","navidad"],
   dims:[["Diámetro","14 cm"],["Alto","30 cm"]],
   desc:"Hurricane de vidrio soplado con aro de latón envejecido. Admite vela de hasta 8 cm de diámetro y protege la llama del viento de terraza.",
   matx:"Vidrio soplado a boca. Aro de latón envejecido.",
   care:"Lavar a mano con agua tibia. El aro de latón no va al lavavajillas."}),
 P(20,"Ámbar","Jarrón de vidrio","decoracion","jarrones",240,["ambar"],"p-jarron-2",
  {mat:"Vidrio",place:"Comedor",lead:"Entrega inmediata",esp:["comedor","navidad"],gal:["p-jarron-1"],
   dims:[["Diámetro","18 cm"],["Alto","26 cm"],["Boca","9 cm"]],
   desc:"Jarrón de vidrio ámbar soplado a boca. El tono cambia según la luz que reciba: más miel de mañana, más caramelo al atardecer.",
   matx:"Vidrio soplado artesanal. Cada pieza tiene burbujas y variaciones de espesor.",
   care:"Lavar a mano."}),
 P(21,"Barranco","Espejo de latón","decoracion","espejos",1450,["oro"],"p-espejo-1",
  {mat:"Latón",place:"Recibidor",lead:"3 semanas",esp:["sala","navidad"],gal:["p-espejo-2"],
   dims:[["Diámetro","90 cm"],["Profundidad","4 cm"],["Peso","11 kg"]],
   desc:"Espejo circular con marco de latón envejecido a mano, pieza por pieza. Se cuelga horizontal sobre una consola o vertical en un pasillo angosto.",
   matx:"Marco de latón macizo con pátina aplicada a mano. Luna de 5 mm con respaldo protegido.",
   care:"Limpiar la luna con paño de microfibra apenas húmedo, nunca el marco con líquidos."}),
 P(22,"Chorrillos","Bandeja de latón","decoracion","objetos",390,["oro"],"p-jarron-1",
  {mat:"Latón",place:"Sala",lead:"Entrega inmediata",stock:"out",esp:["comedor"],
   dims:[["Largo","42 cm"],["Ancho","28 cm"],["Alto","4 cm"]],
   desc:"Bandeja rectangular de latón pulido con base de fieltro. Ordena la mesa de centro sin ocuparla del todo.",
   matx:"Latón pulido con laca protectora. Base de fieltro.",
   care:"Paño seco. La laca evita que oxide, pero no la meta al agua."}),
 P(23,"Arena","Cojín de lino","decoracion","textiles",145,["arena","crudo","verde"],"p-textil-1",
  {mat:"Lino",place:"Sala",lead:"Entrega inmediata",esp:["sala","navidad"],
   dims:[["Medida","50 × 50 cm"],["Relleno","Pluma incluida"]],
   desc:"Funda de lino lavado con cierre invisible, relleno de pluma incluido. El lino lavado ya viene suave: no hay periodo de adaptación.",
   matx:"Lino 100 % lavado en prenda. Relleno de pluma de pato con funda interior de algodón.",
   care:"Lavado a máquina en frío, ciclo suave. Secar a la sombra."}),
 P(24,"Amazonas","Papel mural panorámico","papel","panoramico",180,["verde"],"p-papel-1",
  {mat:"Papel",place:"Dormitorio",style:"Botánico",lead:"2 semanas",esp:["dormitorio"],
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
  {mat:"Cerámica",place:"Comedor",lead:"Entrega inmediata",esp:["comedor"],gal:["p-mesapuesta-1"],
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
  {mat:"Lino",place:"Comedor",style:"Navidad",lead:"Entrega en 48 horas",esp:["navidad","comedor"],
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

var LINEAS_PR = ["Visual merchandising","Retail","Residencial","Hotelería","Temporada"];

var PROYECTOS = [
 {slug:"walon-tiendas", t:"Walon", sub:"Fachadas y vitrinas de cadena", linea:"Visual merchandising",
  anio:"2024", lugar:"Lima y provincias", cover:"pr-walon-1",
  gal:["pr-walon-1","pr-walon-2","pr-walon-3","pr-walon-4"],
  datos:[["Cliente","Walon"],["Línea","Visual merchandising"],["Alcance","Fachada, vitrina y mobiliario de exhibición"],["Locales","Cadena nacional"],["Año","2024"]],
  txt:["Una cadena deportiva no se resuelve tienda por tienda: se resuelve una vez y se replica. El encargo fue definir cómo se ve una tienda Walon desde la vereda y cómo se ordena el producto adentro, con un criterio que pudiera bajar a cualquier local sin que el estudio estuviera presente.",
       "El trabajo empezó por la fachada iluminada y el frente de vitrina, que es lo único que el comprador ve antes de decidir si entra. Adentro se ordenó la pared de producto por altura de alcance y se reservó el nivel del ojo para la campaña vigente.",
       "El resultado se entregó como manual de implantación: medidas, materiales, alturas y secuencia de montaje. Cada local nuevo se arma con el manual y una visita de acompañamiento."]},

 {slug:"nova-campana", t:"Nova", sub:"Campaña de lanzamiento en punto de venta", linea:"Visual merchandising",
  anio:"2024", lugar:"Lima", cover:"pr-nova-1",
  gal:["pr-nova-1","pr-nova-2","pr-nova-3"],
  datos:[["Cliente","Nova"],["Línea","Visual merchandising"],["Alcance","Exhibidor de marca y gráfica de campaña"],["Plazo","14 días"],["Año","2024"]],
  txt:["Un lanzamiento de calzado tiene dos semanas para existir. Pasado ese plazo la campaña se retira y entra la siguiente, así que todo lo que se diseña tiene que poder montarse rápido, verse caro y desmontarse sin dañar la sala.",
       "Se diseñó un exhibidor retroiluminado que aísla el producto del ruido de la tienda: fondo oscuro, luz dirigida y una sola línea de mensaje. El zapato es lo único iluminado del módulo, y eso basta.",
       "La gráfica se produjo en formato modular para poder reusar la estructura en la campaña siguiente cambiando solo la lámina impresa."]},

 {slug:"figuritas-isla", t:"Figuritas", sub:"Isla de marca en tienda ancla", linea:"Retail",
  anio:"2023", lugar:"Lima", cover:"pr-figuritas-1",
  gal:["pr-figuritas-1","pr-figuritas-2"],
  datos:[["Cliente","Figuritas"],["Línea","Retail"],["Alcance","Isla de marca y maniquí de exhibición"],["Superficie","12 m²"],["Año","2023"]],
  txt:["Una isla en pasillo de tienda ancla compite con todo lo que tiene alrededor. La única defensa es la altura y el orden: subir el producto a la línea del ojo y dejar el piso limpio.",
       "Se montó una plataforma elevada con maniquí central y perímetro de producto complementario, de modo que la pieza se lee desde los cuatro lados del pasillo.",
       "El módulo se fabricó en el taller del estudio y se instaló en una madrugada, entre el cierre y la apertura de la tienda."]},

 {slug:"orion-lanzamiento", t:"Orión", sub:"Frente de tienda y campaña de temporada", linea:"Visual merchandising",
  anio:"2025", lugar:"Lima", cover:"pr-orion-1",
  gal:["pr-orion-1","pr-orion-2"],
  datos:[["Cliente","Orión"],["Línea","Visual merchandising"],["Alcance","Frente de tienda, vitrina y gráfica"],["Plazo","Campaña de temporada"],["Año","2025"]],
  txt:["El frente de tienda es la pieza de mayor retorno de toda una sala de ventas y casi siempre la peor resuelta. Aquí se trabajó como se trabaja una portada: una imagen, un mensaje y nada más compitiendo.",
       "Se retiró todo el producto del primer metro de vitrina, se iluminó desde arriba y adelante, y se dejó el fondo en oscuro para que la gráfica de campaña respire.",
       "El montaje se documentó paso a paso para que el equipo de tienda pueda repetirlo en la campaña siguiente."]},

 {slug:"mobiliario-serie", t:"Mobiliario de exhibición", sub:"Del plano al módulo instalado", linea:"Retail",
  anio:"2024", lugar:"Taller del estudio", cover:"pr-plano-1",
  gal:["pr-plano-1","pr-plano-2","pr-plano-3"],
  datos:[["Línea","Mueblería y retail"],["Alcance","Diseño, plano de despiece y fabricación"],["Entregable","Manual de implantación"],["Año","2024"]],
  txt:["Antes de que exista un mueble existe un plano, y antes del plano existe una discusión sobre cuánto producto tiene que entrar en cuántos metros lineales. Ese es el trabajo que no se ve y el que decide si la tienda funciona.",
       "Cada módulo se modela en tres dimensiones, se valida en isometría con el cliente y recién entonces baja a plano de despiece para el taller. El prototipo se arma completo antes de autorizar la serie.",
       "Trabajar con taller propio permite corregir en dos días lo que tercerizado tomaría tres semanas, y es la razón por la que los plazos de campaña se cumplen."]},

 {slug:"sala-arenales", t:"Sala de ventas Arenales", sub:"Layout y recorrido de compra", linea:"Retail",
  anio:"2023", lugar:"Lince, Lima", cover:"pr-sala-1",
  gal:["pr-sala-1","pr-sala-2","pr-sala-3"],
  datos:[["Línea","Retail"],["Alcance","Layout, ambientación y recorrido"],["Superficie","320 m²"],["Año","2023"]],
  txt:["Una sala de muebles tiene un problema que no tiene ninguna otra tienda: el producto es enorme y el cliente necesita imaginárselo en su casa, no verlo en una fila.",
       "Se rompió la disposición en pasillos y se armaron ambientes completos, cada uno con su alfombra, su iluminación y su mesa puesta. El recorrido se diseñó para que se cruce por cinco ambientes antes de llegar a caja.",
       "Los ambientes se renuevan por temporada y son los mismos que después se ofrecen enteros en la tienda en línea."]},

 {slug:"depa-san-isidro", t:"Departamento en San Isidro", sub:"Diseño interior integral", linea:"Residencial",
  anio:"2024", lugar:"San Isidro, Lima", cover:"pr-sanisidro-1",
  gal:["pr-sanisidro-1","pr-sanisidro-2","pr-sanisidro-3"],
  datos:[["Línea","Diseño interior"],["Alcance","Distribución, mobiliario a medida e iluminación"],["Superficie","145 m²"],["Año","2024"]],
  txt:["El encargo llegó con los muebles ya comprados, que es la manera más común y más cara de empezar un proyecto. La primera reunión sirvió para explicar por qué convenía devolver dos de ellos.",
       "Se rehízo la distribución del área social, se abrió el paso a la terraza y se resolvió el dormitorio principal con un mueble a medida que ordena vestidor y escritorio en el mismo frente.",
       "La paleta se mantuvo en neutros cálidos con acentos en madera y latón, para que el departamento envejezca bien y no dependa de una temporada."]},

 {slug:"banos-autor", t:"Baños de autor", sub:"Del render a la obra terminada", linea:"Residencial",
  anio:"2025", lugar:"Lima", cover:"pr-bano-1",
  gal:["pr-bano-1","pr-bano-2","pr-bano-3","pr-bano-4"],
  datos:[["Línea","Diseño interior"],["Alcance","Proyecto, render y supervisión"],["Ambientes","Cuatro baños"],["Año","2025"]],
  txt:["El baño es el ambiente donde más se nota la diferencia entre un proyecto pensado y uno resuelto en obra. Son pocos metros, mucha instalación y ningún margen para improvisar.",
       "Cada baño se modeló completo antes de picar la primera pared: enchapes, juntas, altura de nicho y punto de luz. El cliente aprueba el render y lo que se construye es exactamente eso.",
       "El mobiliario del lavatorio se fabricó en el taller del estudio, en melamina hidrófuga con canto macizo, y se instaló ya lijado y sellado."]},

 {slug:"lodge-valle", t:"Lodge en el valle", sub:"Hotelería rural", linea:"Hotelería",
  anio:"2023", lugar:"Sierra del Perú", cover:"pr-lodge-1",
  gal:["pr-lodge-1","pr-lodge-2","pr-lodge-3","pr-lodge-4"],
  datos:[["Línea","Hotelería"],["Alcance","Comedor, recepción y habitaciones"],["Materiales","Piedra, madera y textil andino"],["Año","2023"]],
  txt:["Un lodge en la sierra no se decora con lo que se ve bien en Lima. El material tiene que aguantar el frío, la altura y el uso duro de un comedor que sirve tres turnos al día.",
       "Se trabajó con piedra del lugar, madera vista y textilería andina de la zona, encargada a talleres cercanos al proyecto. El resultado tiene identidad y además se puede reponer sin traer nada de la costa.",
       "La iluminación se resolvió con puntos cálidos bajos sobre cada mesa, que es lo que hace que un comedor grande se sienta acogedor cuando está a media capacidad."]},

 {slug:"resto-piedra", t:"Restaurante de piedra y madera", sub:"Salón, terraza y mesa puesta", linea:"Hotelería",
  anio:"2023", lugar:"Sierra del Perú", cover:"pr-resto-1",
  gal:["pr-resto-1","pr-resto-2","pr-resto-3"],
  datos:[["Línea","Hotelería"],["Alcance","Salón, terraza acristalada y montaje de mesa"],["Aforo","90 comensales"],["Año","2023"]],
  txt:["El salón tenía una vista que valía todo el proyecto y una distribución que la desperdiciaba. Lo primero fue girar las mesas.",
       "Se acristaló la terraza para ganar aforo en temporada de lluvias y se bajó la altura de todo lo que estorbaba la línea de horizonte: mamparas, separadores y hasta los respaldos de las sillas.",
       "El montaje de mesa se diseñó con textil de la zona y vajilla de gres, y se dejó documentado en una ficha para que el equipo de sala lo repita todos los días igual."]},

 {slug:"navidad-montada", t:"Navidad montada", sub:"Campaña completa, montaje y desmontaje", linea:"Temporada",
  anio:"2025", lugar:"Lima", cover:"pr-navidad-1",
  gal:["pr-navidad-1","pr-navidad-2","pr-navidad-3","pr-navidad-4"],
  datos:[["Línea","Decoración de temporada"],["Alcance","Árbol, nacimiento, vitrina y mesa"],["Servicio","Montaje, desmontaje y guardado"],["Año","2025"]],
  txt:["La Navidad de una casa y la de una sala de ventas se montan igual: con calendario, con inventario y con alguien que se lleve las cajas en enero.",
       "El nacimiento se construye a mano en el taller, pieza por pieza, con acabado de barro y madera envejecida. Es la parte del encargo que no se compra hecha y la que se recuerda al año siguiente.",
       "El servicio incluye el desmontaje de la primera semana de enero y el guardado del material rotulado, que es lo que evita comprar todo de nuevo cada diciembre."]}
];

/* ---------- relato ampliado de cada proyecto -----------------------------
   La ficha de proyecto necesita contar tres cosas antes de enseñar fotos:
   qué pedía el cliente, de dónde salió la idea y qué se hizo. Va aparte
   para no engordar el array de arriba, y se funde con él al cargar.
   ------------------------------------------------------------------------ */

var RELATOS = {
 "walon-tiendas":{
  reto:"Una cadena deportiva con locales en Lima y provincias necesitaba que todas sus tiendas se leyeran igual desde la vereda, sin que el estudio tuviera que estar presente en cada apertura.",
  inspira:"La referencia no fue una tienda: fue la cartelería luminosa de los estadios. Fondo oscuro, tipografía ancha y una sola cosa iluminada por vez. En un centro comercial saturado, apagar es lo que hace ver.",
  cita:"Una cadena no se resuelve tienda por tienda. Se resuelve una vez y se replica.",
  mats:["Acero pintado al horno","Perfil de aluminio","LED 4000 K","Vinilo de corte","Melamina hidrófuga"]},

 "nova-campana":{
  reto:"Un lanzamiento de calzado con dos semanas de vida en sala. Todo tenía que montarse rápido, verse caro y desmontarse sin dañar el local.",
  inspira:"La vitrina de una joyería. El zapato se trató como se trata un anillo: fondo negro, foco dirigido y aire alrededor. El producto es lo único iluminado del módulo.",
  cita:"Si todo brilla, no brilla nada. Se ilumina una cosa y se apaga el resto.",
  mats:["MDF laminado negro","Cinta LED cálida","Acrílico esmerilado","Impresión sobre PVC"]},

 "figuritas-isla":{
  reto:"Doce metros cuadrados en el pasillo de una tienda ancla, compitiendo con todo lo que tenía alrededor y sin paredes donde apoyarse.",
  inspira:"Los podios de premiación. Subir el producto, dejar el piso limpio y que la pieza se lea desde los cuatro lados del pasillo, como una escultura en una plaza.",
  cita:"Sin paredes, la única defensa es la altura.",
  mats:["Tarima de melamina","Césped sintético","Maniquí articulado","Gráfica retroiluminada"]},

 "orion-lanzamiento":{
  reto:"El frente de tienda es la pieza de mayor retorno de toda una sala y casi siempre la peor resuelta: llena de producto, de precios y de mensajes que compiten.",
  inspira:"Se trabajó como se trabaja la portada de una revista. Una imagen, un mensaje y nada más peleando por la atención.",
  cita:"Se vació el primer metro de vitrina. Ahí empezó a funcionar.",
  mats:["Estructura modular de aluminio","Panel arquitectónico curvo","Iluminación de acento","Pintura mate"]},

 "mobiliario-serie":{
  reto:"Definir un mobiliario de exhibición que entrara en locales de metrajes distintos sin rediseñarlo cada vez, y que el equipo de tienda pudiera armar sin el estudio.",
  inspira:"La carpintería de barco: piezas que encajan por diseño, no por ajuste en obra. Si el módulo depende de un maestro con lija, no se puede replicar.",
  cita:"Antes del mueble está el plano, y antes del plano está cuánto producto entra en cuántos metros lineales.",
  mats:["Melamina de 18 mm","Canto macizo de roble","Herrajes con freno","Perfil LED empotrado"]},

 "sala-arenales":{
  reto:"Una sala de muebles de 320 m² dispuesta en pasillos, donde el cliente veía producto en fila y no lograba imaginárselo en su casa.",
  inspira:"Las casas piloto de una inmobiliaria. Se dejó de exhibir mobiliario y se empezó a exhibir ambientes, cada uno con su alfombra, su luz y su mesa puesta.",
  cita:"Nadie compra un sofá en una fila de sofás.",
  mats:["Alfombra de lana","Iluminación cálida dirigida","Tabiquería ligera","Textil de lino"]},

 "depa-san-isidro":{
  reto:"El encargo llegó con los muebles ya comprados, que es la manera más común y más cara de empezar un proyecto.",
  inspira:"La luz de la terraza a las cinco de la tarde. Toda la paleta se eligió para que funcionara con esa luz, y no con la del catálogo.",
  cita:"La primera reunión sirvió para explicar por qué convenía devolver dos de ellos.",
  mats:["Roble al aceite","Travertino sellado","Latón envejecido","Lino lavado","Bouclé"]},

 "banos-autor":{
  reto:"Cuatro baños con pocos metros, mucha instalación y ningún margen para improvisar en obra.",
  inspira:"Los baños de hotel bien resueltos: nicho a la altura del hombro, junta continua y ni un solo cable a la vista. El lujo ahí es que nada estorbe.",
  cita:"El cliente aprueba el render y lo que se construye es exactamente eso.",
  mats:["Porcelánico rectificado","Melamina hidrófuga","Grifería negra mate","Espejo con luz perimetral"]},

 "lodge-valle":{
  reto:"Un lodge en la sierra, con frío, altura y un comedor que sirve tres turnos al día. El material tenía que aguantar el uso, no solo la foto.",
  inspira:"La casa de hacienda andina: piedra del lugar, madera vista y textil de la zona. Nada traído de la costa, para que todo se pueda reponer sin flete.",
  cita:"Lo que se ve bien en Lima no siempre aguanta a cuatro mil metros.",
  mats:["Piedra del lugar","Madera vista","Textil andino","Cerámica de taller"]},

 "resto-piedra":{
  reto:"Un salón con una vista que valía todo el proyecto y una distribución que la desperdiciaba.",
  inspira:"El comedor de una casa de campo: mesas largas, altura baja de todo lo que estorba y la ventana como único cuadro de la pared.",
  cita:"Lo primero fue girar las mesas.",
  mats:["Cristal templado","Madera tratada","Gres esmaltado","Textil de la zona"]},

 "navidad-montada":{
  reto:"Montar la Navidad completa de una sala de ventas y de casas particulares, con calendario, inventario y alguien que se lleve las cajas en enero.",
  inspira:"Los nacimientos de barro de las casas antiguas. Se decidió construirlo a mano, pieza por pieza, en vez de comprarlo hecho: es la parte que la gente recuerda al año siguiente.",
  cita:"Lo que no se compra hecho es lo que se recuerda.",
  mats:["Barro modelado","Madera envejecida","Follaje de fibra","Luz cálida 2700 K","Textil de terciopelo"]}
};

PROYECTOS.forEach(function(p){
  var r = RELATOS[p.slug];
  if(!r) return;
  for(var k in r){ if(Object.prototype.hasOwnProperty.call(r,k)) p[k] = r[k]; }
});

/* ---------- compra el espacio ------------------------------------------- */

var ESPACIOS = [
 {slug:"sala", name:"Sala de neutros cálidos", img:"esp-sala",
  text:"Travertino, lino crudo y latón envejecido. Todo en la misma familia de tono, nada compitiendo."},
 {slug:"comedor", name:"Comedor de diario", img:"esp-comedor",
  text:"Mesa de tablón, sillas apilables y un colgante tejido a mano. Para ocho personas y para el desayuno de un martes."},
 {slug:"terraza", name:"Terraza de verano", img:"esp-terraza",
  text:"Teca sin tratar, textiles que aguantan la humedad y luz cálida. Pensada para la garúa de Lima, no para una postal del Mediterráneo."},
 {slug:"dormitorio", name:"Dormitorio principal", img:"esp-dormitorio",
  text:"Madera clara, lino lavado y una pared con papel mural que hace todo el trabajo."},
 {slug:"navidad", name:"Vitrina de temporada", img:"pr-navidad-1",
  text:"El montaje navideño de una sala de ventas real. Es lo que el estudio hace para tiendas, disponible también para su casa."}
];

/* ---------- puntos sobre la fotografía -----------------------------------
   Cada ambiente lleva marcadas las piezas que se pueden comprar. Las
   coordenadas van en porcentaje del ancho y del alto de la propia foto,
   así que el contenedor tiene que respetar la proporción de la imagen:
   si se recorta, los puntos dejan de caer donde deben.
   ------------------------------------------------------------------------ */

var PUNTOS = {
 "esp-sala":[
   {x:50, y:82, id:3},   /* sillón curvo en primer plano */
   {x:63, y:57, id:1},   /* sofá modular del fondo */
   {x:26, y:65, id:9},   /* mesa de centro */
   {x:15, y:55, id:23},  /* cojín del sofá izquierdo */
   {x:42, y:46, id:20},  /* jarrón de la repisa */
   {x:92, y:82, id:10}], /* mesa lateral acanalada */

 "esp-comedor":[
   {x:52, y:15, id:18},  /* colgante */
   {x:19, y:40, id:21},  /* espejo orgánico */
   {x:40, y:63, id:11},  /* mesa de comedor */
   {x:20, y:74, id:7},   /* silla tapizada */
   {x:33, y:60, id:37},  /* mesa puesta */
   {x:66, y:52, id:20}], /* jarrón con follaje */

 "esp-terraza":[
   {x:20, y:72, id:4},   /* banca de exterior */
   {x:17, y:63, id:23},  /* cojín */
   {x:40, y:62, id:6},   /* butaca de fibra */
   {x:53, y:66, id:10},  /* mesa lateral */
   {x:78, y:62, id:3}],  /* butaca del fondo */

 "esp-dormitorio":[
   {x:50, y:82, id:6},   /* puf de pie de cama */
   {x:22, y:43, id:16},  /* lámpara de mesa */
   {x:35, y:47, id:23},  /* cojín estampado */
   {x:14, y:57, id:14},  /* mesa de noche */
   {x:80, y:43, id:16}], /* lámpara de mesa gemela */

 "port-alcoba":[
   {x:48, y:28, id:34},  /* panel de chinoiserie */
   {x:9,  y:63, id:16},  /* lámpara de mesa */
   {x:38, y:73, id:23},  /* cojín */
   {x:84, y:62, id:16},  /* lámpara de mesa gemela */
   {x:78, y:77, id:19}], /* objeto de la mesa de noche */

 "port-coleccion":[
   {x:15, y:58, id:16},  /* lámpara de mesa */
   {x:50, y:88, id:12},  /* consola */
   {x:50, y:38, id:26},  /* marco restaurado */
   {x:33, y:70, id:19},  /* hurricane */
   {x:85, y:58, id:16}], /* lámpara de mesa gemela */

 "pr-navidad-1":[
   {x:50, y:45, id:27},  /* árbol */
   {x:62, y:30, id:32},  /* ornamentos */
   {x:35, y:56, id:33},  /* luces */
   {x:70, y:70, id:29}]  /* corona */
};

/* ---------- blog --------------------------------------------------------- */

var NOTAS = [
 {k:"Visual merchandising", t:"Cómo se piensa una vitrina que sí vende", r:"6 min", img:"blog-4",
  d:"El recorrido del ojo, la jerarquía del producto y por qué la mayoría de vitrinas en Lima se arman al revés."},
 {k:"Proceso", t:"Qué preguntar antes de remodelar", r:"7 min", img:"blog-1",
  d:"Las ocho preguntas que hacemos en la primera visita, y lo que cada respuesta cambia en el presupuesto."},
 {k:"Obra", t:"Travertino en Lima: lo que nadie le cuenta", r:"5 min", img:"blog-2",
  d:"Es poroso, la garúa lo marca y el sellado no es opcional. Aun así lo seguimos usando, y explicamos por qué."},
 {k:"Interiorismo", t:"El error de comprar los muebles primero", r:"5 min", img:"blog-6",
  d:"Casi todos empiezan por el sofá. Explicamos por qué conviene empezar por la luz y la circulación."},
 {k:"Retail", t:"Una campaña de temporada en catorce días", r:"8 min", img:"blog-5",
  d:"Cómo se planifica, produce y monta una campaña navideña completa para una sala de ventas."},
 {k:"Materiales", t:"Del render a la obra: por qué casi nunca coinciden", r:"6 min", img:"blog-3",
  d:"Qué se puede prometer con una imagen y qué depende del enchape que llegue esa semana a la ferretería."}
];

/* ---------- campañas de portada ------------------------------------------ */

var CAMPS = [
 {img:"port-alcoba", eye:"Diseño interior", t:"Espacios que inspiran, experiencias que trascienden",
  p:"Arquitectura, interiorismo y mueblería a medida. Gian dirige cada proyecto: no hay un ejecutivo de cuenta en el medio.",
  cta:"Ver los servicios", go:"servicios"},
 {img:"port-coleccion", eye:"La colección", t:"Piezas que envejecen bien",
  p:"Travertino, bouclé y latón envejecido. Mobiliario y decoración que se llevan con lo que ya tiene en casa.",
  cta:"Entrar a la tienda", go:"cat:muebles"},
 {img:"port-vitrina", eye:"Visual merchandising", t:"El espacio es lo primero que vende",
  p:"Vitrinas, islas de marca y campañas de temporada para cadenas de tienda. La línea con más recorrido del estudio.",
  cta:"Ver los proyectos", go:"proyectos"}
];

# Giandeco Studio Design — maqueta

Maqueta navegable del sitio de **Giandeco Studio Design**, organizada como el
negocio: tres servicios y dos páginas.

## Las dos versiones

| Versión | Enlace |
|---|---|
| **Tema claro** — el que arranca por defecto | https://yedi06.github.io/giandeco-tienda/ |
| **Tema oscuro** — la misma maqueta en acabado oscuro | https://yedi06.github.io/giandeco-tienda/oscuro.html |

En la cabecera hay un interruptor sol/luna para comparar al vuelo.

## El árbol del sitio

```
RETAIL                        HOGAR                     CATÁLOGO
  Diseño de tiendas             Diseño de interiores      Mueblería        ← abierta
  Proyectos                     Espacios                  Piezas únicas    ← abierta
  Blog                          Proyectos                 Compra el espacio ← abierta
  Contacto                      Blog                      Iluminación      · próximamente
                                                          Decoración       · próximamente
QUIÉNES SOMOS    CONTACTO                                 Papel mural      · próximamente
                                                          Navidad          · campaña, noviembre
```

Los tres servicios van a la izquierda de la marca; las dos páginas, a la
derecha. **Entrar a un mundo filtra el sitio entero**: estando en Retail,
Proyectos y Blog sólo traen retail; estando en Hogar, sólo hogar.

## Qué cambió en esta versión

- **Menú nuevo.** Fuera Catálogo / Diseño de interiores / Nuestro universo.
  Entran Retail, Hogar y Catálogo, más Quiénes somos y Contacto.
- **Dos páginas de servicio** con la misma plantilla: promesa, cifras,
  entregables, proceso, proyectos y blog del mundo, y llamada a la acción.
  El método de cada una tiene nombre: **Marca en sala** (Retail) y
  **Casa resuelta** (Hogar).
- **Boceto y obra.** Un marco con el dibujo a lápiz a la izquierda y la
  fotografía a la derecha, y un tirador para pasar de uno a otro. Va justo
  debajo del banner de cada servicio. Sin una palabra sobre la imagen.
- **Quiénes somos.** Gian a la cabeza, la historia del estudio, las cifras,
  el equipo (Martha, diseñadora de interiores; Lucía, arquitecta) y los
  proyectos en los que participó. Botones accionables en cada tramo.
- **La tienda en línea todavía no abre.** El sitio funciona como catálogo con
  cotización: sin carrito ni pago. Cada pieza lleva a *Solicitar cotización*.
- **Mueblería** absorbió Asientos y Muebles: es una sola línea, la del taller,
  con tres familias (Asientos, Mesas, Guardado).
- **Ficha de producto** rehecha: la descripción dejó de ser un acordeón y pasó
  a ser un relato con fotografía a ancho completo, alternando lado.

## Estructura

```
index.html          la maqueta, tema claro por defecto
claro.html          copia de index.html, para que el enlace ya compartido siga vivo
oscuro.html         la misma maqueta arrancando en oscuro
hacer-temas.ps1     regenera claro.html y oscuro.html a partir de index.html
hacer-bocetos.py    genera la versión a lápiz de una foto → img/sk-<nombre>.jpg
css/giandeco.css    sistema de diseño; los dos temas son tokens
js/datos.js         todo el contenido: catálogo, proyectos, servicios, equipo, blog
js/app.js           todo el comportamiento
img/                fotografías, bocetos (sk-*), logo y favicon
```

`index.html` es la única fuente de verdad del marcado. Después de tocarlo hay
que ejecutar `hacer-temas.ps1`.

## Dos interruptores que valen por una versión entera

En `js/datos.js`:

- `var ECOMMERCE = false;` — en `true` devuelve el carrito, el precio con
  botón de compra y el cajón lateral. Todo el marcado sigue ahí.
- `estado:"activo"` en cada línea de `TAX` — cambiarlo abre esa categoría en
  el menú, en la portada y en el catálogo. No hay nada más que tocar.

## Los bocetos

`hacer-bocetos.py` saca el dibujo **de la propia fotografía**, no de un banco
de imágenes: por eso las dos mitades encajan pixel a pixel y el efecto se lee
como «esto se dibujó y luego se construyó».

```bash
python hacer-bocetos.py              # regenera todos los pares
python hacer-bocetos.py pr-casa-3    # sólo uno
```

Son material de trabajo. Cuando lleguen los bocetos a mano del estudio, se
reemplaza el archivo `sk-*.jpg` con el mismo nombre y el sitio no se entera.

## Estado

Maqueta de presentación. Pendiente de confirmar con el estudio:

- **Retratos de Gian, Martha y Lucía.** Ahora hay un monograma en su lugar.
  Al llegar las fotos, se rellena `img` en `EQUIPO` de `js/datos.js`.
- **Las cifras** de las páginas de servicio y de Quiénes somos (+40 locales,
  8 marcas, +60 proyectos) están puestas como ejemplo. Hay que confirmarlas.
- **Nombres de cliente, años y alcances** de Proyectos siguen como ejemplo, y
  hay que **autorizar la mención de cada marca**.
- **Fotografía de producto sobre fondo limpio**: todas las tomas actuales son
  de ambiente.
- Sigue pendiente la carpeta «90 CONFIRMAR si son de Gian»; ninguna de esas
  108 fotos se usa aquí.

---

Desarrollo: **Yedi SG** · yedifreelancer@gmail.com

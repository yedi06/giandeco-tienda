# Giandeco Studio Design — maqueta

Maqueta navegable del sitio de **Giandeco Studio Design**: los dos mundos del
estudio en un mismo sitio, servicios y proyectos por un lado, tienda en línea
por el otro.

## Las dos versiones

| Versión | Enlace |
|---|---|
| **Tema oscuro** — la paleta de la campaña del estudio | https://yedi06.github.io/giandeco-tienda/ |
| **Tema claro** — la misma paleta sobre fondos claros | https://yedi06.github.io/giandeco-tienda/claro.html |

Las dos son el mismo sitio con distinta piel. En la cabecera hay un interruptor
**Oscuro / Claro** para comparar al vuelo sin cambiar de dirección.

## Qué cambió en esta versión

- **Fuera los círculos.** Las categorías y las subcategorías ahora son
  rectángulos grandes, con la primera ficha a doble tamaño. Se ve el ambiente
  completo, no un recorte del tamaño de un icono.
- **Proyectos.** Vista nueva con rejilla de dos columnas desfasadas, cuadros
  grandes, filtro por línea y ficha propia para cada proyecto, con relato,
  datos y galería.
- **Servicios.** Las cinco líneas del estudio presentadas en franjas
  alternadas de imagen y texto, más los tres modos de contratación y el
  proceso de trabajo.
- **Los dos mundos** en la portada: el estudio a la izquierda, la tienda a la
  derecha, como hace la referencia de Mis en Demeure.
- **Tipografía real.** Cormorant Garamond para los titulares y Jost para la
  interfaz, cargadas del servidor. Antes dependía de las fuentes instaladas en
  cada máquina y en Windows caía en Times New Roman.
- **Más aire.** Las bandas pasaron de ~58 px a hasta 120 px de respiro.
- **Fotografía real** del banco aprobado del estudio, en lugar de las
  imágenes anteriores.
- En escritorio, hacer clic en una categoría **lleva a la categoría**; el
  panel con las subcategorías se abre al pasar el puntero.

## Estructura

```
index.html          la maqueta, tema oscuro por defecto
claro.html          la misma maqueta, tema claro por defecto (generado)
hacer-claro.ps1     regenera claro.html a partir de index.html
css/giandeco.css    sistema de diseño; los dos temas son tokens
js/datos.js         todo el contenido: catálogo, proyectos, servicios, blog
js/app.js           todo el comportamiento
img/                fotografías, logo y favicon
```

`index.html` es la única fuente de verdad del marcado. Después de tocarlo hay
que ejecutar `hacer-claro.ps1` para que `claro.html` quede al día.

## Estado

Maqueta de presentación. Los productos, precios y fichas técnicas son de
ejemplo: sirven para validar la estructura y el diseño, no son el catálogo
final.

**Pendiente de confirmar con el estudio** antes de publicar de verdad:

- Los nombres de cliente, años y alcances de la sección Proyectos están
  puestos como ejemplo. Hay que confirmarlos y **autorizar la mención de cada
  marca**.
- Falta fotografía de producto sobre fondo limpio: todas las tomas actuales
  son de ambiente.
- Sigue pendiente la carpeta «90 CONFIRMAR si son de Gian»; ninguna de esas
  108 fotos se usa aquí.

---

Desarrollo: **Yedi SG** · yedifreelancer@gmail.com

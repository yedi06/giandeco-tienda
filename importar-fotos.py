# -*- coding: utf-8 -*-
"""
Trae a img/ las fotografías de las carpetas AMBIENTES y PROYECTOS.

El estudio entrega originales de hasta 2400 px y 1,3 MB. En el sitio no hace
falta tanto: ninguna imagen se enseña por encima de 1800 px, y un catálogo
que pesa cuatro veces lo necesario se abre lento en un móvil con datos, que
es donde va a mirarlo la mayoría de la gente.

Se reduce el lado mayor a 1800 px y se guarda en JPEG progresivo al 84. La
carpeta original NO se toca: es el archivo maestro del estudio.

Uso:
    python importar-fotos.py
"""

import os, glob
from PIL import Image, ImageOps

RAIZ   = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
DESTINO = os.path.join(os.path.dirname(os.path.abspath(__file__)), "img")
LADO   = 1800

# carpeta de origen  ->  prefijo con el que se guarda
JUEGOS = [
    ("AMBIENTES/Animales en el Bosque",     "bosque"),
    ("AMBIENTES/Casa Grande/Sala",          "cg-sala"),
    ("AMBIENTES/Casa Grande/Sala Comedor",  "cg-com"),
    ("AMBIENTES/Casa Grande/Habitación",    "cg-hab"),
    ("AMBIENTES/Convivir con el Arte",      "arte"),
    ("AMBIENTES/Hogar",                     "mesa"),
    ("AMBIENTES/Navidad Atemporal",         "navid"),
    ("AMBIENTES/Raíces y Hogar",            "raices"),
    ("AMBIENTES/Walon 35 Años",             "w35"),
    ("PROYECTOS/Figuritas del Barrio",      "fig"),
    ("PROYECTOS/Hotel Unión",               "union"),
    ("PROYECTOS/Massimo Café",              "massimo"),
]


def importar(carpeta, prefijo):
    origen = os.path.join(RAIZ, carpeta)
    fotos = sorted(glob.glob(os.path.join(origen, "*.jpg")))
    if not fotos:
        print("  sin fotos en " + carpeta)
        return []

    nombres = []
    for i, f in enumerate(fotos, 1):
        im = Image.open(f)
        im = ImageOps.exif_transpose(im).convert("RGB")   # respeta la orientación de cámara
        if max(im.size) > LADO:
            escala = LADO / float(max(im.size))
            im = im.resize((round(im.width * escala), round(im.height * escala)), Image.LANCZOS)

        nombre = "%s-%d" % (prefijo, i)
        salida = os.path.join(DESTINO, nombre + ".jpg")
        im.save(salida, "JPEG", quality=84, optimize=True, progressive=True)
        nombres.append(nombre)

    peso = sum(os.path.getsize(os.path.join(DESTINO, n + ".jpg")) for n in nombres)
    print("  %-9s %2d fotos  %4d KB" % (prefijo, len(nombres), peso // 1024))
    return nombres


if __name__ == "__main__":
    print("Importando de AMBIENTES y PROYECTOS:")
    todos = {}
    for carpeta, prefijo in JUEGOS:
        todos[prefijo] = importar(carpeta, prefijo)
    print("%d imágenes en img/" % sum(len(v) for v in todos.values()))

# -*- coding: utf-8 -*-
"""
Genera la versión "boceto a lápiz" de una fotografía del estudio.

El sitio enseña el par en el mismo marco —el boceto a la izquierda, la obra
terminada a la derecha— igual que las referencias que aprobó el cliente. El
boceto NO es una ilustración aparte: sale de la misma foto, así que las dos
mitades encajan pixel a pixel y el efecto se lee como "esto se dibujó y luego
se construyó".

Uso:
    python hacer-bocetos.py                 # regenera todos los pares
    python hacer-bocetos.py pr-casa-2 ...   # solo los que se indiquen

Salida: img/sk-<nombre>.jpg
"""

import sys, os
from PIL import Image, ImageFilter, ImageOps, ImageEnhance
import numpy as np

IMG = "img"
ANCHO = 1600          # el boceto no necesita más: es medio marco
PAPEL = (247, 244, 238)   # blanco cálido, nunca #fff: el papel del estudio

# Fotos que hoy tienen par en el sitio. Añadir aquí las nuevas.
PARES = [
    # retail
    "pr-walon-1", "pr-walon-3", "pr-orion-1", "pr-figuritas-1",
    "pr-nova-1", "pr-sala-1", "pr-sala-2", "pr-resto-1",
    # hogar
    "pr-casa-1", "pr-casa-3", "pr-casa-8", "pr-bano-1", "pr-bano-3",
    "pr-sanisidro-1", "pr-sanisidro-3",
    # catálogo y temporada
    "cat-muebles", "esp-sala", "esp-comedor", "pr-navidad-2",
]


def boceto(nombre):
    ruta = os.path.join(IMG, nombre + ".jpg")
    if not os.path.exists(ruta):
        print("  falta " + ruta)
        return False

    im = Image.open(ruta).convert("RGB")
    if im.width > ANCHO:
        im = im.resize((ANCHO, round(im.height * ANCHO / im.width)), Image.LANCZOS)

    # 0. alisado previo. Sin esto, el grano del enchape y de la pared entra al
    #    dodge y el dibujo sale sucio: parece fotocopia, no lápiz.
    im = im.filter(ImageFilter.MedianFilter(size=5)).filter(ImageFilter.SMOOTH_MORE)

    # 1. lápiz: color dodge entre el gris y su negativo desenfocado.
    gris = ImageOps.autocontrast(im.convert("L"), cutoff=1)
    desenfoque = ImageOps.invert(gris).filter(ImageFilter.GaussianBlur(radius=max(2, im.width // 260)))

    g = np.asarray(gris, dtype=np.float32)
    b = np.asarray(desenfoque, dtype=np.float32)
    trazo = np.where(b >= 255, 255.0, np.minimum(255.0, g * 255.0 / (255.0 - b + 1e-3)))

    # 2. gamma alta: las superficies planas se van a blanco de papel y solo
    #    sobrevive la línea. Es lo que separa un dibujo de un negativo.
    trazo = 255.0 * np.power(trazo / 255.0, 2.4)

    # 3. refuerza los bordes duros — las líneas de arquitectura del dibujo.
    bordes = np.asarray(gris.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(0.6)), dtype=np.float32)
    trazo = np.clip(trazo - bordes * 0.75, 0, 255)

    lapiz = Image.fromarray(trazo.astype(np.uint8), mode="L")
    lapiz = ImageEnhance.Contrast(lapiz).enhance(1.3)

    # 4. sobre papel cálido, no sobre blanco puro.
    papel = Image.new("RGB", lapiz.size, PAPEL)
    tinta = Image.new("RGB", lapiz.size, (38, 33, 28))
    fuera = Image.composite(tinta, papel, ImageOps.invert(lapiz))

    salida = os.path.join(IMG, "sk-" + nombre + ".jpg")
    fuera.save(salida, "JPEG", quality=84, optimize=True, progressive=True)
    print("  sk-%s.jpg  %d x %d  %d KB" % (nombre, fuera.width, fuera.height,
                                           os.path.getsize(salida) // 1024))
    return True


if __name__ == "__main__":
    objetivos = sys.argv[1:] or PARES
    print("Bocetos a partir de la fotografía del estudio:")
    hechos = sum(1 for n in objetivos if boceto(n))
    print("%d de %d generados." % (hechos, len(objetivos)))

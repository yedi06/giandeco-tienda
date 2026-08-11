# Genera claro.html a partir de index.html.
# index.html es la única fuente de verdad: la versión clara sólo cambia
# el tema por defecto, el título y el color de la barra del navegador.
# Ejecutar después de cualquier cambio en index.html.

$raiz = Split-Path -Parent $MyInvocation.MyCommand.Path
$src  = Join-Path $raiz "index.html"
$dst  = Join-Path $raiz "claro.html"

$h = Get-Content $src -Raw -Encoding UTF8

$h = $h -replace '<html lang="es" data-tema="oscuro">', '<html lang="es" data-tema="claro">'
$h = $h -replace '<meta name="theme-color" content="#0E0C09" />', '<meta name="theme-color" content="#FBFAF7" />'
$h = $h -replace '<title>Giandeco Studio Design</title>', '<title>Giandeco Studio Design — versión clara</title>'
$h = $h -replace 'data-tema-set="oscuro" aria-pressed="true"', 'data-tema-set="oscuro" aria-pressed="false"'
$h = $h -replace 'data-tema-set="claro" aria-pressed="false"', 'data-tema-set="claro" aria-pressed="true"'

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($dst, $h, $utf8NoBom)

"claro.html generado ({0} KB)" -f [int]((Get-Item $dst).Length/1KB)

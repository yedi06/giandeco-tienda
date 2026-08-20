# Genera claro.html y oscuro.html a partir de index.html, y sella la version
# de los archivos de estilo y de guion.
#
# index.html es la unica fuente de verdad del marcado y arranca en OSCURO,
# que es el acabado de la marca y el que ve primero quien entra.
#   oscuro.html  copia identica, para que el enlace ya compartido siga vivo
#   claro.html   la misma maqueta arrancando en claro
#
# ESTE ARCHIVO VA EN UTF-8 CON BOM. PowerShell 5.1 lee como ANSI todo .ps1
# que no lo lleve, y la raya del titulo salia como "a?~" en el HTML generado.
#
# EL SELLO DE VERSION IMPORTA. GitHub Pages sirve el CSS y el JS con cache
# larga. Sin sello, quien ya visito el sitio recibe el HTML nuevo con el guion
# viejo: una mezcla que se ve rota. El sello es un hash del contenido de
# css/giandeco.css + js/datos.js + js/app.js, asi que cambia solo cuando
# alguno cambia de verdad, y obliga al navegador a bajarlos de nuevo.
#
# Ejecutar despues de cualquier cambio en index.html, en el CSS o en el JS.

$raiz = Split-Path -Parent $MyInvocation.MyCommand.Path
$src  = Join-Path $raiz "index.html"
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

# --- sello: hash corto del contenido de los tres archivos ------------------
$piezas = @("css\giandeco.css", "js\datos.js", "js\app.js") |
          ForEach-Object { Get-Content (Join-Path $raiz $_) -Raw -Encoding UTF8 }
$todo   = [System.Text.Encoding]::UTF8.GetBytes(($piezas -join "`n"))
$sha    = [System.Security.Cryptography.SHA1]::Create()
$sello  = ([System.BitConverter]::ToString($sha.ComputeHash($todo)) -replace '-','').Substring(0,8).ToLower()

$base = Get-Content $src -Raw -Encoding UTF8

# Se limpia el sello anterior antes de poner el nuevo, para no encadenarlos.
$base = $base -replace 'href="css/giandeco\.css(\?v=[a-f0-9]+)?"', "href=`"css/giandeco.css?v=$sello`""
$base = $base -replace 'src="js/datos\.js(\?v=[a-f0-9]+)?"',       "src=`"js/datos.js?v=$sello`""
$base = $base -replace 'src="js/app\.js(\?v=[a-f0-9]+)?"',         "src=`"js/app.js?v=$sello`""

# index.html se reescribe con el sello puesto: es la fuente de verdad.
[System.IO.File]::WriteAllText($src, $base, $utf8NoBom)

# --- oscuro.html: identico a index.html, que ya arranca en oscuro ---
[System.IO.File]::WriteAllText((Join-Path $raiz "oscuro.html"), $base, $utf8NoBom)

# --- claro.html: solo cambia el tema de arranque ---
$clr = $base
$clr = $clr -replace '<html lang="es" data-tema="oscuro">', '<html lang="es" data-tema="claro">'
$clr = $clr -replace '<meta name="theme-color" content="#21201E" />', '<meta name="theme-color" content="#FBFAF7" />'
$clr = $clr -replace '<title>Giandeco Studio Design</title>', '<title>Giandeco Studio Design — acabado claro</title>'
[System.IO.File]::WriteAllText((Join-Path $raiz "claro.html"), $clr, $utf8NoBom)

# El sello tambien va suelto en version.txt: el sitio lo consulta al abrirse
# y se recarga si esta enseñando una version vieja guardada en cache.
[System.IO.File]::WriteAllText((Join-Path $raiz "version.txt"), $sello, $utf8NoBom)

"sello de version: $sello"
foreach($f in @("index.html","claro.html","oscuro.html")){
  "{0} ({1} KB)" -f $f, [int]((Get-Item (Join-Path $raiz $f)).Length/1KB)
}

# Avisos si algun reemplazo no encontro su objetivo.
if($clr -notmatch 'data-tema="claro"'){ Write-Warning "claro.html no quedo en tema claro: revisa el marcado de <html>" }
if($base -notmatch "app\.js\?v=$sello"){ Write-Warning "el sello no se aplico al guion: revisa las etiquetas <script>" }

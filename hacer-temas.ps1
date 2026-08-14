# Genera claro.html y oscuro.html a partir de index.html.
#
# index.html es la unica fuente de verdad del marcado y arranca en claro.
#   claro.html   copia identica, para que el enlace ya compartido siga vivo
#   oscuro.html  la misma maqueta arrancando en oscuro
#
# Ejecutar despues de cualquier cambio en index.html.

$raiz = Split-Path -Parent $MyInvocation.MyCommand.Path
$src  = Join-Path $raiz "index.html"
$base = Get-Content $src -Raw -Encoding UTF8
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

# --- claro.html: identico a index.html ---
[System.IO.File]::WriteAllText((Join-Path $raiz "claro.html"), $base, $utf8NoBom)

# --- oscuro.html: solo cambia el tema de arranque ---
$osc = $base
$osc = $osc -replace '<html lang="es" data-tema="claro">', '<html lang="es" data-tema="oscuro">'
$osc = $osc -replace '<meta name="theme-color" content="#FBFAF7" />', '<meta name="theme-color" content="#0E0C09" />'
$osc = $osc -replace '<title>Giandeco Studio Design</title>', '<title>Giandeco Studio Design — acabado oscuro</title>'
$osc = $osc -replace 'data-tema-set="claro" aria-pressed="true"',  'data-tema-set="claro" aria-pressed="false"'
$osc = $osc -replace 'data-tema-set="oscuro" aria-pressed="false"','data-tema-set="oscuro" aria-pressed="true"'
[System.IO.File]::WriteAllText((Join-Path $raiz "oscuro.html"), $osc, $utf8NoBom)

foreach($f in @("claro.html","oscuro.html")){
  "{0} generado ({1} KB)" -f $f, [int]((Get-Item (Join-Path $raiz $f)).Length/1KB)
}

# Aviso si el reemplazo del tema no encontro su objetivo.
if($osc -notmatch 'data-tema="oscuro"'){ Write-Warning "oscuro.html no quedo en tema oscuro: revisa el marcado de <html>" }

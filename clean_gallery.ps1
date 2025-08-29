# Script para limpiar las referencias a GalleryManager antigua del script.js

# Leer el archivo original
$scriptContent = Get-Content "script.js" -Raw

# Crear backup del archivo original
Copy-Item "script.js" "script.js.backup3"

Write-Host "Backup creado en script.js.backup3"

# Remover todas las referencias a adjustGalleryContainers
$scriptContent = $scriptContent -replace "adjustGalleryContainers\(\);", "// adjustGalleryContainers(); // REMOVIDO"

# Remover todas las instancias de new GalleryManager()
$scriptContent = $scriptContent -replace "new GalleryManager\(\);", "// new GalleryManager(); // REMOVIDO"

# Remover la función adjustGalleryContainers completa
$scriptContent = $scriptContent -replace "function adjustGalleryContainers\(\) \{[\s\S]*?\}", "// Función adjustGalleryContainers removida"

# Escribir el nuevo contenido
Set-Content "script.js" $scriptContent -Encoding UTF8

Write-Host "Limpieza completada exitosamente!"
Write-Host "Se removieron todas las referencias a GalleryManager y adjustGalleryContainers"

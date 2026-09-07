<#
.SYNOPSIS
    Starts a zero-dependency lightweight local HTTP server on Windows.
#>
param(
    [int]$Port = 8080
)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
try {
    $listener.Start()
    Write-Host "===================================================" -ForegroundColor Cyan
    Write-Host " Local Web Server running at: http://localhost:$Port" -ForegroundColor Green
    Write-Host " Press Ctrl+C in this terminal to stop the server" -ForegroundColor Yellow
    Write-Host "===================================================" -ForegroundColor Cyan

    Start-Process "http://localhost:$Port/"

    $rootDir = $PSScriptRoot

    $mimeTypes = @{
        ".html"  = "text/html; charset=utf-8"
        ".css"   = "text/css; charset=utf-8"
        ".js"    = "application/javascript; charset=utf-8"
        ".json"  = "application/json; charset=utf-8"
        ".png"   = "image/png"
        ".jpg"   = "image/jpeg"
        ".jpeg"  = "image/jpeg"
        ".svg"   = "image/svg+xml"
        ".pdf"   = "application/pdf"
        ".ico"   = "image/x-icon"
        ".woff2" = "font/woff2"
        ".woff"  = "font/woff"
        ".ttf"   = "font/ttf"
    }

    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            $urlPath = [System.Uri]::UnescapeDataString($request.Url.LocalPath.TrimStart('/'))
            if ([string]::IsNullOrWhiteSpace($urlPath)) {
                $urlPath = "index.html"
            }
            $urlPath = $urlPath.Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $filePath = Join-Path $rootDir $urlPath

            if (Test-Path $filePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
                $response.ContentType = $contentType
                $response.StatusCode = 200

                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $bytes.Length

                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $response.StatusCode = 404
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.ContentType = "text/plain; charset=utf-8"
                $response.ContentLength64 = $errBytes.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
                }
            }
            $response.Close()
        } catch {
            Write-Warning $_.Exception.Message
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
}

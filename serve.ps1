# Runs the game on a lab PC with nothing installed: a small local web server (Windows PowerShell only), then opens the game.
# Started by «تشغيل اللعبة.bat». Close this window to stop the game server.
param([switch]$NoOpen)
$root = $PSScriptRoot
$types = @{ '.html'='text/html; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.json'='application/json; charset=utf-8';
  '.webp'='image/webp'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.png'='image/png'; '.svg'='image/svg+xml'; '.woff2'='font/woff2'; '.webmanifest'='application/manifest+json'; '.glb'='model/gltf-binary' }
function Open-Game($u) {
  foreach ($exe in @("$env:ProgramFiles (x86)\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Google\Chrome\Application\chrome.exe", "$env:ProgramFiles (x86)\Google\Chrome\Application\chrome.exe", "$env:LocalAppData\Google\Chrome\Application\chrome.exe")) {
    if (Test-Path $exe) { Start-Process $exe -ArgumentList "--app=$u", '--start-maximized'; return }
  }
  Start-Process $u
}
# the game is already running (the file was double-clicked twice): open it on the SAME port, so the pupils' saved results stay (committee r8)
try { $null = Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 'http://localhost:8765/play.html'; if (-not $NoOpen) { Open-Game 'http://localhost:8765/play.html' }; exit 0 } catch {}
$listener = $null
foreach ($port in 8765..8785) {
  $l = New-Object System.Net.HttpListener
  $l.Prefixes.Add("http://localhost:$port/")
  try { $l.Start(); $listener = $l; break } catch { $l.Close() }
}
if (-not $listener) { Write-Host 'تعذّر تشغيل اللعبة على هذا الجهاز. / Could not start the game server.'; Read-Host 'اضغط Enter للإغلاق / Press Enter to close'; exit 1 }
$url = "http://localhost:$port/play.html"
Write-Host "لعبة مفاتيح بطل الأمان تعمل الآن: $url"
Write-Host 'أبقِ هذه النافذة مفتوحة ما دام التلاميذ يلعبون، وأغلقها في نهاية الحصة.'
Write-Host 'Safety Keys is running. Keep this window open while pupils play.'
if ($port -ne 8765) { Write-Host 'تنبيه: المنفذ 8765 مشغول، فنتائج التلاميذ المحفوظة سابقاً لن تظهر هنا. / Port 8765 busy: earlier saved results will not show.' }
if (-not $NoOpen) { Open-Game $url }
while ($listener.IsListening) {
  try { $ctx = $listener.GetContext() } catch { break }
  $res = $ctx.Response
  try {
    $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
    if ($rel -eq '__result') {   # one measured pupil: a line in «نتائج التلاميذ.csv» in the game folder (committee r9)
      $body = (New-Object IO.StreamReader($ctx.Request.InputStream, [Text.Encoding]::UTF8)).ReadToEnd() | ConvertFrom-Json
      $csv = Join-Path $root 'نتائج التلاميذ.csv'; $utf8 = New-Object Text.UTF8Encoding($true)
      if (-not (Test-Path $csv)) { [IO.File]::WriteAllText($csv, $body.head + "`r`n", $utf8) }
      [IO.File]::AppendAllText($csv, $body.line + "`r`n", $utf8)
      $res.StatusCode = 200; $res.Close(); continue
    }
    if ($rel -eq '__quit') { $res.StatusCode = 200; $res.Close(); $listener.Stop(); break }   # the teacher's «إيقاف اللعبة على هذا الجهاز» (teacher panel): this window closes
    if ($rel -eq '') { $rel = 'play.html' }
    $full = [IO.Path]::GetFullPath([IO.Path]::Combine($root, $rel))
    if ($full.StartsWith($root) -and [IO.File]::Exists($full)) {
      $bytes = [IO.File]::ReadAllBytes($full)
      $ext = [IO.Path]::GetExtension($full).ToLower()
      $res.ContentType = if ($types.ContainsKey($ext)) { $types[$ext] } else { 'application/octet-stream' }
      $res.Headers.Add('Cache-Control', 'no-store')
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else { $res.StatusCode = 404 }
  } catch { $res.StatusCode = 500 }
  try { $res.Close() } catch {}
}

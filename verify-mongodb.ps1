# MongoDB Verification Script
Write-Host "🔍 Verifying MongoDB Installation..." -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB service exists
Write-Host "1. Checking MongoDB Service..." -ForegroundColor Yellow
$service = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue

if ($service) {
    Write-Host "   ✅ MongoDB service found" -ForegroundColor Green
    Write-Host "   Status: $($service.Status)" -ForegroundColor White
    
    if ($service.Status -eq "Running") {
        Write-Host "   ✅ MongoDB service is running" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  MongoDB service is not running. Starting..." -ForegroundColor Yellow
        Start-Service -Name "MongoDB"
        Start-Sleep -Seconds 3
        $service = Get-Service -Name "MongoDB"
        Write-Host "   Status after start: $($service.Status)" -ForegroundColor White
    }
} else {
    Write-Host "   ❌ MongoDB service not found" -ForegroundColor Red
    Write-Host "   Please install MongoDB first" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is listening on port 27017
Write-Host ""
Write-Host "2. Checking MongoDB Port (27017)..." -ForegroundColor Yellow
$portCheck = netstat -an | Select-String ":27017"

if ($portCheck) {
    Write-Host "   ✅ MongoDB is listening on port 27017" -ForegroundColor Green
    Write-Host "   Port status: $portCheck" -ForegroundColor White
} else {
    Write-Host "   ❌ MongoDB is not listening on port 27017" -ForegroundColor Red
}

# Check MongoDB Compass installation
Write-Host ""
Write-Host "3. Checking MongoDB Compass..." -ForegroundColor Yellow
$compassPath = Get-ChildItem -Path "C:\Program Files\MongoDB Compass" -ErrorAction SilentlyContinue

if ($compassPath) {
    Write-Host "   ✅ MongoDB Compass is installed" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  MongoDB Compass not found in default location" -ForegroundColor Yellow
}

# Test MongoDB connection
Write-Host ""
Write-Host "4. Testing MongoDB Connection..." -ForegroundColor Yellow
try {
    $mongoPath = Get-Command mongosh -ErrorAction SilentlyContinue
    if ($mongoPath) {
        Write-Host "   ✅ MongoDB shell (mongosh) found" -ForegroundColor Green
        Write-Host "   Path: $($mongoPath.Source)" -ForegroundColor White
    } else {
        Write-Host "   ⚠️  MongoDB shell not found in PATH" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ MongoDB shell not available" -ForegroundColor Red
}

# Check if our server can connect
Write-Host ""
Write-Host "5. Testing Server Connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        $healthData = $response.Content | ConvertFrom-Json
        Write-Host "   ✅ Server is running" -ForegroundColor Green
        Write-Host "   Database Status: $($healthData.database)" -ForegroundColor White
        Write-Host "   Uptime: $([math]::Round($healthData.uptime, 2)) seconds" -ForegroundColor White
    }
} catch {
    Write-Host "   ❌ Cannot connect to server on port 5000" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
if ($service -and $service.Status -eq "Running") {
    Write-Host "   ✅ MongoDB is running! Restart your server to connect." -ForegroundColor Green
    Write-Host "   Run: npm start" -ForegroundColor White
} else {
    Write-Host "   ❌ Please install and start MongoDB first" -ForegroundColor Red
    Write-Host "   Download from: https://www.mongodb.com/try/download/community" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')

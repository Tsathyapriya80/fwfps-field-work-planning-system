#!/usr/bin/env pwsh

Write-Host "Testing Java Backend API endpoints..." -ForegroundColor Green

# Wait a moment for server to be ready
Start-Sleep -Seconds 2

# Test GET PAC endpoint
Write-Host "`nTesting GET /api/pac..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8090/api/pac" -Method Get -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Content: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test POST PAC endpoint
Write-Host "`nTesting POST /api/pac..." -ForegroundColor Yellow
try {
    $body = '{"name":"Test PAC","description":"This is a test PAC entry"}'
    $response = Invoke-WebRequest -Uri "http://localhost:8090/api/pac" -Method Post -ContentType "application/json" -Body $body -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Content: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test GET PAC endpoint again to see if data was created
Write-Host "`nTesting GET /api/pac again..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8090/api/pac" -Method Get -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Content: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test GET Workplan endpoint
Write-Host "`nTesting GET /api/workplan..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8090/api/workplan" -Method Get -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Content: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nAPI testing completed!" -ForegroundColor Green

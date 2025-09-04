# FWFPS Java Backend API Test Script
# Testing APIs on http://localhost:8090

Write-Host "=== FWFPS Java Backend API Test ===" -ForegroundColor Green
Write-Host "Testing server on http://localhost:8090" -ForegroundColor Cyan

$baseUrl = "http://localhost:8090"

# Test function
function Test-API {
    param($Method, $Endpoint, $Body = $null)
    
    Write-Host "`n--- Testing: $Method $Endpoint ---" -ForegroundColor Yellow
    
    try {
        $params = @{
            Uri = "$baseUrl$Endpoint"
            Method = $Method
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = $Body | ConvertTo-Json
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "SUCCESS:" -ForegroundColor Green
        Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor White
        
        return $response
    }
    catch {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        }
        return $null
    }
}

# Test all GET endpoints
Write-Host "`n🔍 Testing GET Endpoints..." -ForegroundColor Magenta
Test-API -Method "GET" -Endpoint "/api/pac"
Test-API -Method "GET" -Endpoint "/api/workplan" 
Test-API -Method "GET" -Endpoint "/api/pps"
Test-API -Method "GET" -Endpoint "/api/operations"

# Test POST endpoints (Create operations)
Write-Host "`n➕ Testing POST Endpoints..." -ForegroundColor Magenta

# Create a PAC
$pacData = @{
    name = "Sample PAC"
    description = "This is a test PAC created via API"
}
$createdPac = Test-API -Method "POST" -Endpoint "/api/pac" -Body $pacData

# Create a Workplan
$workplanData = @{
    title = "Sample Workplan"
    details = "This is a test workplan created via API"
}
$createdWorkplan = Test-API -Method "POST" -Endpoint "/api/workplan" -Body $workplanData

# Create a PPS
$ppsData = @{
    code = "PPS001"
    info = "This is a test PPS created via API"
}
$createdPps = Test-API -Method "POST" -Endpoint "/api/pps" -Body $ppsData

# Create an Operation
$operationData = @{
    type = "Field Survey"
    status = "Active"
}
$createdOperation = Test-API -Method "POST" -Endpoint "/api/operations" -Body $operationData

# Test GET endpoints again to show created data
Write-Host "`n📋 Testing GET Endpoints Again (should show created data)..." -ForegroundColor Magenta
Test-API -Method "GET" -Endpoint "/api/pac"
Test-API -Method "GET" -Endpoint "/api/workplan"
Test-API -Method "GET" -Endpoint "/api/pps"
Test-API -Method "GET" -Endpoint "/api/operations"

Write-Host "`n✅ API Testing Complete!" -ForegroundColor Green
Write-Host "Database Console: http://localhost:8090/h2-console" -ForegroundColor Cyan
Write-Host "JDBC URL: jdbc:h2:file:./fwfps" -ForegroundColor Cyan

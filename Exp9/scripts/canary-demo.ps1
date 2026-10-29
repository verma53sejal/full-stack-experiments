param(
    [ValidateRange(1, 1000)]
    [int]$Requests = 20,

    [ValidateRange(0, 100)]
    [int]$CanaryPercent = 10,

    [string]$StableUrl = "http://localhost:8081",

    [string]$CanaryUrl = "http://localhost:8082"
)

$stableCount = 0
$canaryCount = 0

for ($requestNumber = 1; $requestNumber -le $Requests; $requestNumber++) {
    $useCanary = (Get-Random -Minimum 0 -Maximum 100) -lt $CanaryPercent
    if ($useCanary) {
        $baseUrl = $CanaryUrl
        $canaryCount++
        $routeName = "canary"
    }
    else {
        $baseUrl = $StableUrl
        $stableCount++
        $routeName = "stable"
    }

    $response = Invoke-RestMethod -Uri "$baseUrl/api/status"
    Write-Host ("Request {0,2}: {1,-6} -> version {2}" -f $requestNumber, $routeName, $response.version)
}

Write-Host ""
Write-Host "Local routing totals (random selection, not guaranteed percentages):"
Write-Host "Stable: $stableCount"
Write-Host "Canary: $canaryCount"
Write-Host "This is a local simulation, not a production load balancer."

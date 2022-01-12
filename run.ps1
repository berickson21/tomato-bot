# This script updates the config file and build list. The file paths are not generic.

$ErrorActionPreference = "SilentlyContinue"
Stop-Transcript | out-null
$ErrorActionPreference = "Continue"
Start-Transcript -path repos\tomato-bot\update_output.txt -append

Write-Host "==========================================================================`n"
Write-Host "Set-Location C:\repos\tomato-bot \n" && Set-Location C:\repos\tomato-bot 

Write-Host "==============================================================================================================="
Write-Host "git stash" && git stash 
$stashSuccess = (($?) ? $true : $false)

# Update builds.json from WG API and ship build sheet
Write-Host "==============================================================================================================="
Write-Host "git checkout master" && git checkout master 

Write-Host "==============================================================================================================="
Write-Host "git pull" && git pull 

if ($stashSuccess) { 
  Write-Host "==============================================================================================================="
  Write-Host "git stash pop" && git stash pop 
}
else { Write-Host "Stash failed. Not popping." }

Write-Host "==========================================================================`n"
Write-Host "Updating Builds..." && node .\tools\update-builds.js

Write-Host "==============================================================================================================="
Write-Host "git add.\resources\builds.json" && git add resources\builds.json resources\config.json

Write-Host "==============================================================================================================="
Write-Host "git commit -m 'updated ship builds $(Get-Date)'" && git commit -m "updated ship builds $(Get-Date)"

# update message count telemetry
Write-Host "==============================================================================================================="
Write-Host "git add .\count.json" && git add count.json

Write-Host "==============================================================================================================="
Write-Host "git commit -m 'updated message count $(Get-date)'" && git commit -m "updated message count $(Get-date)" 

Write-Host "==============================================================================================================="
Write-Host "git push" && git push

Write-Host "===============================================================================================================`n"
Write-Host "Done."

Write-Host "==========================================================================`n"
Write-Host "forever restartall" && forever restartall

Stop-Transcript
$ErrorActionPreference = "Stop"

$DbName = "livrili"
$DbUser = "postgres"
$DbPassword = "password"
$DbHost = "localhost"
$DbPort = "5432"
$ScriptPath = Join-Path $PSScriptRoot "livrili-database.sql"

if (-not (Get-Command psql -ErrorAction SilentlyContinue)) {
  Write-Error "psql is not installed or not available in PATH."
}

$env:PGPASSWORD = $DbPassword
$env:PGCLIENTENCODING = "UTF8"

Write-Host "Checking database '$DbName'..."
$exists = psql -U $DbUser -h $DbHost -p $DbPort -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DbName';"

if ($exists.Trim() -ne "1") {
  Write-Host "Creating database '$DbName'..."
  psql -U $DbUser -h $DbHost -p $DbPort -d postgres -c "CREATE DATABASE $DbName;"
}

Write-Host "Applying schema and seed from '$ScriptPath'..."
psql -v ON_ERROR_STOP=1 -U $DbUser -h $DbHost -p $DbPort -d $DbName -f $ScriptPath

Write-Host "Database setup completed successfully."

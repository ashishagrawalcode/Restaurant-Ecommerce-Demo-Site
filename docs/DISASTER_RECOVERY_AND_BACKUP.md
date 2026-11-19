# The Saffron Plate - Disaster Recovery & Data Backup Runbook

This runbook establishes standard operating procedures (SOPs) for data backup, database integrity verification, snapshot restoration, and disaster recovery for **The Saffron Plate** restaurant data stores.

---

## 1. Storage Redundancy & Failure Domains

The restaurant platform stores business-critical operational data across six collections:
1. `menu.json` - Master food and beverage catalog
2. `orders.json` - Customer orders and financial summaries
3. `reservations.json` - Dining room bookings and guest seating
4. `reviews.json` - Verified customer feedback and rating records
5. `contacts.json` - Administrative inquiries and messages
6. `users.json` - Patron accounts and authorization records

To prevent data loss resulting from hardware failure, cloud provider outages, or accidental truncation, operational backups are partitioned into:
- **Hot Local Snapshots**: Automated rolling backups of `backend/data/*.json` stored on the host filesystem.
- **Cold Off-Site Archives**: Compressed weekly snapshots stored in detached cloud storage.
- **MongoDB Point-in-Time Recovery**: Continuous cloud backup provided via MongoDB Atlas replica sets.

---

## 2. Automated Local Backup Script

### 2.1 PowerShell Snapshot Script (`backup-data.ps1`)
Save the following utility script in the root directory to perform zero-downtime JSON data snapshots:

```powershell
# backup-data.ps1 - Automated Saffron Plate JSON Data Snapshot Tool
$DataDir = Join-Path $PSScriptRoot "backend\data"
$BackupRootDir = Join-Path $PSScriptRoot "backups"
$Timestamp = (Get-Date).ToString("yyyyMMdd_HHmmss")
$Destination = Join-Path $BackupRootDir "snapshot_$Timestamp"

if (-not (Test-Path $BackupRootDir)) {
    New-Item -ItemType Directory -Path $BackupRootDir | Out-Null
}

New-Item -ItemType Directory -Path $Destination | Out-Null

$Files = Get-ChildItem -Path $DataDir -Filter "*.json"
foreach ($file in $Files) {
    Copy-Item -Path $file.FullName -Destination $Destination
    Write-Host "Backed up: $($file.Name) -> $Destination" -ForegroundColor Green
}

Write-Host "Snapshot completed successfully at $Timestamp" -ForegroundColor Cyan
```

---

## 3. Data Integrity Verification & JSON Repair

In the event of an unexpected server shutdown or process termination during a write operation:

1. **Verify JSON Syntax**:
   Run the following verification command to test all data files:
   ```powershell
   Get-ChildItem backend\data\*.json | ForEach-Object {
       try {
           Get-Content $_.FullName -Raw | ConvertFrom-Json | Out-Null
           Write-Host "✓ OK: $($_.Name)" -ForegroundColor Green
       } catch {
           Write-Host "✗ CORRUPT: $($_.Name) - $($_.Exception.Message)" -ForegroundColor Red
       }
   }
   ```

2. **Restore from Snapshot**:
   If any file fails JSON validation, restore from the latest clean snapshot:
   ```powershell
   $LatestSnapshot = Get-ChildItem backups\snapshot_* | Sort-Object CreationTime -Descending | Select-Object -First 1
   Copy-Item -Path "$($LatestSnapshot.FullName)\*" -Destination "backend\data\" -Force
   Write-Host "Restored backend data from: $($LatestSnapshot.Name)" -ForegroundColor Yellow
   ```

---

## 4. Emergency Failover Checklist

If the primary MongoDB cluster becomes unreachable during service:
1. **Confirm Native Fallback**: Check the terminal running `server.js`. The server will log:
   `Running in JSON database mode`
2. **Zero Downtime**: The application continues serving HTTP requests immediately using the `backend/data/*.json` local stores.
3. **Database Re-connection**: When MongoDB service is restored, restart `server.js` or reload the environment to resume live two-way replication.

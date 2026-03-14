$ErrorActionPreference = 'Stop'
$base = 'http://localhost:4000/api'

function Login {
  param([string]$email, [string]$password)
  Invoke-RestMethod -Method Post -Uri "$base/auth/login" -ContentType 'application/json' -Body (@{ email = $email; password = $password } | ConvertTo-Json)
}

$candidate = Login -email 'candidate@driverschool.local' -password 'Admin@123456'
$instructor = Login -email 'instructor@driverschool.local' -password 'Admin@123456'
$admin = Login -email 'admin@driverschool.local' -password 'Admin@123456'

$publicInstructors = Invoke-RestMethod -Method Get -Uri "$base/marketplace/instructors?page=1&pageSize=10"
$instructorId = $publicInstructors.items[0].id
$instructorDetail = Invoke-RestMethod -Method Get -Uri "$base/marketplace/instructors/$instructorId"
$packageId = $instructorDetail.packages[0].id

$slots = Invoke-RestMethod -Method Get -Uri "$base/availability/slots?instructorProfileId=$instructorId" -Headers @{ Authorization = "Bearer $($instructor.tokens.accessToken)" }
$activeSlot = $slots | Where-Object { $_.isActive -eq $true } | Select-Object -First 1
if (-not $activeSlot) {
  throw 'No active availability slot found for selected instructor.'
}

function Get-NextWeekdayDateUtc {
  param([int]$weekday)
  $now = (Get-Date).ToUniversalTime()
  $candidate = $now.Date
  $days = ($weekday - [int]$candidate.DayOfWeek + 7) % 7
  if ($days -eq 0) { $days = 7 }
  return $candidate.AddDays($days)
}

function Parse-HHMM {
  param([string]$time)
  $parts = $time.Split(':')
  return @{ H = [int]$parts[0]; M = [int]$parts[1] }
}

$slotDate = Get-NextWeekdayDateUtc -weekday ([int]$activeSlot.weekday)
$slotStart = Parse-HHMM -time $activeSlot.startTime
$slotEnd = Parse-HHMM -time $activeSlot.endTime

$startDate = [DateTime]::SpecifyKind((Get-Date -Date ("{0:yyyy-MM-dd} {1:D2}:{2:D2}:00" -f $slotDate, $slotStart.H, $slotStart.M)), [DateTimeKind]::Utc)
$maxEnd = [DateTime]::SpecifyKind((Get-Date -Date ("{0:yyyy-MM-dd} {1:D2}:{2:D2}:00" -f $slotDate, $slotEnd.H, $slotEnd.M)), [DateTimeKind]::Utc)
$desiredEnd = $startDate.AddMinutes(50)
$endDate = if ($desiredEnd -le $maxEnd) { $desiredEnd } else { $maxEnd }

if ($endDate -le $startDate) {
  throw 'Active availability slot is too short to create a lesson window.'
}

$start = $startDate.ToString('yyyy-MM-ddTHH:mm:ss.000Z')
$end = $endDate.ToString('yyyy-MM-ddTHH:mm:ss.000Z')

$bookingBody = @{
  instructorProfileId = $instructorId
  packageId = $packageId
  scheduledStart = $start
  scheduledEnd = $end
}
$booking = Invoke-RestMethod -Method Post -Uri "$base/bookings" -Headers @{ Authorization = "Bearer $($candidate.tokens.accessToken)" } -ContentType 'application/json' -Body ($bookingBody | ConvertTo-Json)

$lessons = Invoke-RestMethod -Method Get -Uri "$base/lessons/me" -Headers @{ Authorization = "Bearer $($instructor.tokens.accessToken)" }
$targetLesson = $lessons | Where-Object { $_.bookingId -eq $booking.id } | Select-Object -First 1

$checkIn = Invoke-RestMethod -Method Patch -Uri "$base/lessons/$($targetLesson.id)/check-in" -Headers @{ Authorization = "Bearer $($instructor.tokens.accessToken)" } -ContentType 'application/json' -Body (@{ pinCode = $targetLesson.pinCode } | ConvertTo-Json)
$started = Invoke-RestMethod -Method Patch -Uri "$base/lessons/$($targetLesson.id)/start" -Headers @{ Authorization = "Bearer $($instructor.tokens.accessToken)" } -ContentType 'application/json' -Body '{}' 
$finished = Invoke-RestMethod -Method Patch -Uri "$base/lessons/$($targetLesson.id)/finish" -Headers @{ Authorization = "Bearer $($instructor.tokens.accessToken)" } -ContentType 'application/json' -Body '{}' 

$paymentsMine = Invoke-RestMethod -Method Get -Uri "$base/payments/me" -Headers @{ Authorization = "Bearer $($candidate.tokens.accessToken)" }
$payment = $paymentsMine | Where-Object { $_.bookingId -eq $booking.id } | Select-Object -First 1

$disputeBody = @{
  bookingId = $booking.id
  lessonId = $targetLesson.id
  paymentId = $payment.id
  reason = 'Teste fluxo'
  description = 'Fluxo end-to-end'
}
$dispute = Invoke-RestMethod -Method Post -Uri "$base/disputes" -Headers @{ Authorization = "Bearer $($candidate.tokens.accessToken)" } -ContentType 'application/json' -Body ($disputeBody | ConvertTo-Json)

$incidentBody = @{
  bookingId = $booking.id
  lessonId = $targetLesson.id
  type = 'OTHER'
  severity = 'LOW'
  description = 'Teste de incidente'
}
$incident = Invoke-RestMethod -Method Post -Uri "$base/incidents" -Headers @{ Authorization = "Bearer $($candidate.tokens.accessToken)" } -ContentType 'application/json' -Body ($incidentBody | ConvertTo-Json)

$adminPayments = Invoke-RestMethod -Method Get -Uri "$base/payments/admin" -Headers @{ Authorization = "Bearer $($admin.tokens.accessToken)" }
$adminPayouts = Invoke-RestMethod -Method Get -Uri "$base/payouts/admin" -Headers @{ Authorization = "Bearer $($admin.tokens.accessToken)" }
$adminDisputes = Invoke-RestMethod -Method Get -Uri "$base/disputes/admin" -Headers @{ Authorization = "Bearer $($admin.tokens.accessToken)" }
$adminIncidents = Invoke-RestMethod -Method Get -Uri "$base/incidents/admin" -Headers @{ Authorization = "Bearer $($admin.tokens.accessToken)" }

Write-Output "BOOKING=$($booking.id) LESSON=$($targetLesson.id) PAYMENT=$($payment.id)"
Write-Output "DISPUTE=$($dispute.id) INCIDENT=$($incident.id)"
Write-Output "ADMIN_COUNTS payments=$($adminPayments.Count) payouts=$($adminPayouts.Count) disputes=$($adminDisputes.Count) incidents=$($adminIncidents.Count)"

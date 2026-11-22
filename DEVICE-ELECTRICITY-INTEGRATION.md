# Device electricity cost integration

## What changed

- Device detail pages now include a `Цахилгааны хэрэглээ ба төлбөр` panel.
- The panel reads each device's monthly telemetry from the authenticated device-specific endpoint.
- Voltage (V), current (A), and latest power (W) are displayed from the device telemetry (with sensor-array fallback for power/voltage/current).
- Monthly kWh is estimated by integrating adjacent power readings using the trapezoidal rule: average W × elapsed hours / 1000.
- Intervals longer than 30 minutes are skipped rather than assuming the device consumed power continuously while offline.
- The calculated kWh is passed to the existing manually selected user tariff profile and the existing tariff calculator.
- The panel refreshes every 30 seconds and supports selecting a historical month.

## Setup

No new environment variables or database collection are required. The code reuses the existing `Device`, `DeviceLog`, `ElectricityTariff`, auth, and MongoDB models.

The user must save a tariff profile in `/dashboard/electricity` before the device page can calculate a bill.

## Accuracy note

This is an estimate derived from sampled instantaneous power, not a certified utility meter reading. Accuracy depends on telemetry frequency and continuity. Long gaps (>30 minutes) are excluded and shown as skipped intervals. For billing-grade accuracy, send a cumulative energy counter (kWh) from a dedicated energy meter and use its month-start/month-end difference instead.

# MOSFET Electricity Tariff Calculator

## Added features
- New authenticated dashboard page: `/dashboard/electricity`.
- New dashboard overview card showing the saved monthly estimate.
- New sidebar navigation item: `Цахилгааны төлбөр`.
- Per-user tariff settings stored in MongoDB through `/api/electricity-tariff`.
- Tariff selection for household, business/organization, and social-support household categories.
- Single-, two-, and three-tariff meter calculations where supported by the supplied tariff tables.

## Tariff rules encoded from the supplied images

### Households
- Single meter: up to 150 kWh = 184 MNT/kWh; 150–300 kWh = 269; above 300 kWh = 299.
- Two tariff meter: up to 150 kWh = day 191 / night 154; 150–300 kWh = day 236 / night 168; above 300 kWh = day 278 / night 168.
- Three tariff meter: up to 150 kWh = day 179 / evening 294 / night 119; 150–300 kWh = day 200 / evening 305 / night 119; above 300 kWh = day 231 / evening 315 / night 119.
- Household three-tariff time bands: day 06:00–17:00, evening 17:00–21:00, night 21:00–06:00.
- Household two-tariff time bands: day 06:00–21:00, night 21:00–06:00.
- The 3,360 MNT monthly base fee is shown as an optional checkbox because the supplied table's placement does not make its applicability to every household meter type fully explicit. It is offered for three-tariff household calculations only.

### Businesses and organizations
- Industrial/mining/manufacturing: single 328; three-tariff day 328 / evening 547 / night 184.
- Telecommunications: single 289; three-tariff day 289 / evening 459 / night 168.
- Budget organizations: single 292; three-tariff day 292 / evening 437 / night 176.
- Other businesses: single 278; three-tariff day 278 / evening 417 / night 168.
- Business three-tariff time bands: day 06:00–17:00, evening 17:00–22:00, night 22:00–06:00.

### Social-support household category
- Single meter: monthly use up to 100 kWh = 90 MNT/kWh; above 100 kWh = 110 MNT/kWh.

## Calculation notes
- The rates above are copied from the supplied tariff images.
- The image states that the 13.48 MNT/kWh support tariff is included and VAT is excluded. The calculator therefore does not add VAT.
- Multi-tariff household thresholds are selected using the sum of the entered time-band consumption. The selected band's per-kWh rates are applied to each relevant time band; the bands are not treated as progressive marginal blocks.
- The calculator is an estimate based on user-entered meter readings, not an official utility invoice.

## Files added or updated
- `lib/electricity-tariff.ts`
- `models/ElectricityTariff.ts`
- `app/api/electricity-tariff/route.ts`
- `app/dashboard/electricity/page.tsx`
- `components/dashboard/ElectricityBillCard.tsx`
- `app/dashboard/page.tsx`
- `components/layout/Sidebar.tsx`
- Premium glass dashboard components and dashboard route styling are retained in this project package.

## Setup
No new npm dependency is required. Ensure the existing `MONGODB_URI` and Better Auth environment variables are configured. Then run:

```bash
npm install
npm run dev
```

After signing in, open Dashboard → Цахилгааны төлбөр, select the applicable tariff category and meter type, enter the month's kWh usage, and save. The dashboard card will display the saved estimate.

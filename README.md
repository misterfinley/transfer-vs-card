# Transfer vs Card (POC)

A small TypeScript proof-of-concept that compares **bank transfer** vs **card payment** for a USD-to-EUR payment.

## What it does

- Lets you input a USD amount.
- Calculates total payer cost for transfer and card.
- Estimates recipient EUR amount using an FX rate.
- Highlights the cheaper method.
- Supports **mock mode** when external FX API is unavailable.

## Setup

```bash
npm install
npm run build
```

Then open `index.html` in a browser.

## Usage

- Edit the amount and click **Refresh rates** (or type to auto-refresh).
- Use `?mock=1` in the URL to force mock mode.
  - Example: `file:///.../index.html?mock=1`

## Assumptions

- Transfer and card fee models are simplified to percent + fixed fee.
- FX markups are static assumptions for each method.
- Recipient amount is based on sent amount and effective FX rate (fees do not reduce principal sent).

## Limitations

- Not production-grade pricing logic.
- Live mode only pulls one reference rate (USD to EUR).
- No backend; all calculations run client-side.
- Browser CORS/network restrictions may force fallback to mock mode.

## Test

```bash
npm test
```

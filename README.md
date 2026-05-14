# AngularShop

Mini e-commerce frontend built with Angular + Tailwind.

## Features

- Product listing page with search + filters (category, price range, sort)
- Product details page (add to cart)
- Cart page (edit quantities, remove items, order summary)
- Checkout form (reactive + validation)
- Post-checkout order animation (placed → shipped → delivered with an animated car)
- Fake catalog generated locally (no backend)
- LocalStorage cart persistence + toast notifications

## Tech stack

- Angular (standalone components, signals, `@if`/`@for`, `OnPush`)
- Tailwind CSS v4 (utility-first UI)
- Faker (`@faker-js/faker`) for product/order data generation
- RxJS for simulated latency/timers
- Unit tests run via Angular CLI with Vitest

## Getting started

### Prerequisites

- Node.js (LTS recommended)
- pnpm

### Install

```bash
pnpm install
```

### Dev server

```bash
pnpm start
```

Then open http://localhost:4200/

If port `4200` is already in use:

```bash
pnpm start -- --port 4201
```

## App routes

- `/products` — product listing + filters
- `/products/:id` — product details
- `/cart` — cart items + summary
- `/checkout` — checkout form + order animation

## Scripts

- Start dev server: `pnpm start`
- Production build: `pnpm build`
- Development watch build: `pnpm watch`
- Unit tests (single run): `pnpm exec ng test --watch=false`

## Notes

- Data is generated deterministically (seeded) so the catalog is stable between reloads.
- This is a frontend-only demo; checkout does not process payments.

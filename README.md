# Zappy

A local place-discovery interface — browse hotels, restaurants, cafés and
things to do by category, search, and save favourites.

> **Status: frontend only.** Every listing currently comes from
> [`data/mockData.ts`](data/mockData.ts). There is no backend, no persistence
> and no real search yet. It is a complete, working UI waiting for a data
> layer — which makes it a good project to contribute to.

## Features

- Category browsing (hotels, restaurants, cafés, shopping, music, outdoors,
  fitness, bars, bookshops)
- Place detail pages with ratings, review counts and open/closed state
- Search across listings
- Saved places
- User profile
- Responsive layout with a dedicated mobile nav

## Stack

React, TypeScript, Vite, Tailwind CSS, React Router, lucide-react.
Deliberately dependency-light — four runtime dependencies.

## Getting started

**Prerequisites:** Node.js 20+.

```bash
git clone https://github.com/ieeecsopen/Zappy
cd Zappy
npm install
npm run dev
```

No environment variables are needed — it runs entirely on mock data.

```bash
npm run build
npm run preview
```

## Project layout

```
pages/        Categories, CategoryListing, PlaceDetail, Search, Saved, Profile
components/   Header, Hero, Carousel, FeatureCard, MobileNav, Footer
  home/       Homepage sections
  ui/         Shared primitives
data/
  mockData.ts Categories, places and testimonials
types.ts      Place, Category, Testimonial
```

## Where to contribute

Because the UI is done and the data layer isn't, the useful work is unusually
well-defined:

- **Wire up a real backend.** `data/mockData.ts` exports match the `Place` and
  `Category` types in `types.ts` — swapping the source for an API or Supabase
  query is a contained change.
- **Make search real.** It currently filters mock data in memory.
- **Persist saved places** — today they vanish on reload.
- **Accessibility** — keyboard navigation and screen-reader labels.

## Contributing

See [CONTRIBUTING.md](https://github.com/ieeecsopen/.github/blob/main/CONTRIBUTING.md).

## Licence

MIT — see [LICENSE](LICENSE).

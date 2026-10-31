# Shadcn Admin Solid

Admin dashboard UI built with **SolidJS**, **Kobalte**, **Tailwind CSS** and **Vite** — a SolidJS port of [satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin).

It keeps the original's pages, layout, styling and behaviour, but every React piece has been replaced by its Solid counterpart.

## Features

- Light / dark / system theme
- Responsive, collapsible sidebar (inset / floating / sidebar variants, icon / offcanvas modes)
- RTL support
- Global search command palette (<kbd>⌘</kbd> <kbd>K</kbd>)
- Data tables with URL-synced pagination, filters and faceted search, row selection and bulk actions
- Forms with Zod validation
- 10+ pages: dashboard, tasks, users, apps, chats, settings, auth and error pages
- Accessible, unstyled primitives from Kobalte, styled to match shadcn/ui (new-york)

## Tech Stack

| Concern       | React original             | This Solid port                                                           |
| ------------- | -------------------------- | ------------------------------------------------------------------------- |
| UI framework  | React 19                   | [SolidJS](https://www.solidjs.com/)                                       |
| Primitives    | Radix UI                   | [Kobalte](https://kobalte.dev/) (+ [corvu](https://corvu.dev/) OTP field) |
| Styling       | Tailwind CSS v4            | Tailwind CSS v4 (same theme tokens)                                       |
| Routing       | TanStack React Router      | [TanStack Solid Router](https://tanstack.com/router) (file-based)         |
| Data fetching | TanStack React Query       | TanStack Solid Query                                                      |
| Tables        | TanStack React Table       | TanStack Solid Table                                                      |
| Forms         | react-hook-form + zod      | Small signal-based form helper (`src/lib/form.ts`) + zod                  |
| Command menu  | cmdk                       | Lightweight Solid command component (`src/components/ui/command.tsx`)     |
| Charts        | Recharts                   | Lightweight responsive SVG charts (`src/components/charts`)               |
| Date picker   | react-day-picker           | Solid calendar (`src/components/ui/calendar.tsx`)                         |
| Toasts        | sonner                     | solid-sonner                                                              |
| Icons         | lucide-react / Radix icons | lucide-solid                                                              |
| Global state  | zustand                    | Solid stores                                                              |

### Differences from the original

- **Clerk** routes (`/clerk/*`) were removed — Clerk has no official SolidJS SDK.
- Radix's `asChild` is replaced by Kobalte's polymorphic `as` prop, e.g.
  `<DropdownMenuTrigger as={Button} variant='ghost'>`.
- Radix `side` / `align` props become Kobalte's `placement` (e.g. `placement='right-start'`) on the root.
- `data-[state=open]` / `data-[state=checked]` styles become `data-expanded` / `data-checked`.

## Run Locally

```bash
git clone https://github.com/pifranky/shadcn-admin-solid.git
cd shadcn-admin-solid
npm install
npm run dev
```

Other scripts:

```bash
npm run build         # type-check + production build
npm test              # unit tests (vitest)
npm run format        # prettier
```

## Project Structure

```
src/
  assets/       SVG icon components
  components/   layout, data-table, charts and shared components
    ui/         shadcn-style primitives built on Kobalte
  context/      theme, font, direction, layout and search providers
  features/     page implementations (dashboard, tasks, users, ...)
  hooks/        reusable primitives (table URL state, dialogs, ...)
  lib/          utils, cookies, form helper
  routes/       TanStack file-based routes
```

## Credits

Original design and implementation by [@satnaing](https://github.com/satnaing) — [shadcn-admin](https://github.com/satnaing/shadcn-admin).

## License

Licensed under the [MIT License](./LICENSE).

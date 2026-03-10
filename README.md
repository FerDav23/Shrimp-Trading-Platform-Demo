# Shrimp Commercialization Platform – Frontend

Frontend platform for shrimp commercialization in Ecuador. It centralizes packer offers so producers can sell, with integrated logistics management.

---

## About This Repository (Demo)

**This is a demo version of the original project.** Although I received permission from the company to publish the project, I had to leave out sensitive information. The live backend, APIs, real credentials, and other confidential parts are not included. What you see here is a **frontend-only demo** with mock data and fake authentication to showcase the UI and flows.

---

## Tech Stack

- **React 18** with TypeScript
- **Vite** as bundler
- **React Router** for navigation
- **Tailwind CSS** for styling
- **date-fns** for date handling

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/       # Reusable components
├── contexts/        # React contexts (Auth)
├── data/            # Dummy data (users, offers, sales, logistics)
├── layouts/         # Main layouts
├── pages/           # Role-based pages
│   ├── producer/    # Producer pages
│   ├── packer/      # Packer pages
│   ├── logistics/   # Logistics pages
│   └── manager/     # Admin pages
├── types/           # TypeScript types
└── App.tsx          # Main component with routes
```

## Fake Authentication

The system uses local authentication with dummy users. When logging in, you can choose one of the 4 available users:

1. **Juan Pérez** (PRODUCER) – Producer
2. **ROSASUD S.A.S.** (PACKER) – Packer

The selected user is stored in `localStorage` and determines the dashboard and pages available for that role.

## Roles and Permissions

- **PRODUCER**: Can view offers, create sales, view sales history
- **PACKER**: Can create and manage offers, view received sales

## Dummy Data

All data lives in files under `src/data/`:

- `users.ts` – System users
- `offers.ts` – Packer offers
- `sales.ts` – Sales
- `logistics.ts` – Logistics rates and trucks

## Notes

- This is a **frontend-only** app with no backend or database
- All changes are simulated (alerts) and do not persist after refresh
- Data is hardcoded in TypeScript files
- The layout is responsive and uses a modern SaaS-style design

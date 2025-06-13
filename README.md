# Busy Minds

This project contains a minimal web and mobile application skeleton for the Busy Minds app.

- **web** - Next.js + Tailwind CSS frontend with Supabase integration (authentication and database).
- **mobile** - Expo React Native app that shares components where possible.

This repository is only a starting point and does not include installed dependencies.
Make sure to run `npm install` (or `pnpm install`) inside each directory before development.

## Features

 - Create and manage "thought" and "learning" cards.
 - Cards are color coded by type and can be filtered by type, year, month and tag on the dashboard.
 - Each user only sees their own cards after signing in.

## Prerequisites

- A stable Node.js version (Node 18 or later is recommended).

## Setup

1. Copy `web/.env.example` to `web/.env.local` and fill in your Supabase credentials.
2. Install dependencies in each directory:
   ```bash
   cd web && npm install
   cd ../mobile && npm install
   ```
3. Run the web app with `npm run dev` inside the `web` folder.

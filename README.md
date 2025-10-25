# JalanRusak Web Application

A citizen-driven web application for reporting damaged roads in Indonesia. Built with Next.js 15, React 19, and TypeScript.

## 🚀 Features

- **User Authentication**: Secure registration, login, and password reset
- **Report Damaged Roads**: Submit road damage reports with GPS coordinates and photos
- **Interactive Maps**: Mark damaged road locations using Leaflet maps
- **Report Management**: View, filter, and track the status of reports
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Type-Safe**: Full TypeScript implementation with Zod validation

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet & React-Leaflet
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with automatic token refresh
- **Date Formatting**: date-fns

## 📋 Prerequisites

- Node.js 18.x or higher
- pnpm (recommended) or npm/yarn
- Running JalanRusak backend API (default: `http://localhost:8080/api/v1`)

## 🔧 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd jalanrusak-web-app
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
   ```

4. **Start the development server**:
   ```bash
   pnpm dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                          # Next.js app router pages
│   ├── dashboard/                # Protected dashboard area
│   │   ├── layout.tsx            # Dashboard layout with navigation
│   │   ├── page.tsx              # Dashboard home with stats
│   │   └── reports/              # Reports management
│   │       ├── create/           # Create new report
│   │       ├── [id]/             # View report details
│   │       └── page.tsx          # List all reports
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── forgot-password/          # Password reset
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/
│   ├── map/                      # Map components
│   │   ├── MapPicker.tsx         # Interactive map for selecting points
│   │   └── MapView.tsx           # Read-only map display
│   └── ui/                       # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── Textarea.tsx
└── lib/
    ├── api/                      # API client and types
    │   ├── client.ts             # Axios client with auth
    │   └── types.ts              # TypeScript types from backend
    └── env/                      # Environment variable validation
        ├── client.ts
        └── server.ts
```

## 🔐 Authentication Flow

1. **Registration**: Users create an account with username, email, and password
2. **Login**: Authenticate and receive JWT access + refresh tokens
3. **Token Storage**: Tokens stored in localStorage
4. **Auto-Refresh**: Expired access tokens automatically refreshed
5. **Protected Routes**: Dashboard pages require authentication

## 🗺️ Features Guide

### Creating a Report

1. Navigate to **Dashboard** → **New Report**
2. Enter report details:
   - **Title**: Brief description of the damage
   - **Subdistrict Code**: Indonesian administrative code (e.g., `35.10.02.2005`)
   - **Location**: Click on the map to mark damaged road points
   - **Photos**: Provide URLs to damage photos (one per line)
   - **Description**: Additional details (optional)
3. Click **Submit Report**

### Viewing Reports

- **Dashboard**: Overview with statistics
- **All Reports**: Browse all submitted reports with pagination
- **Filter**: Filter reports by status (Pending/Verified/Repaired)
- **Details**: Click any report to see full details including map and photos

## 🎨 Available Scripts

```bash
# Development
pnpm dev              # Start dev server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm type-check       # Run TypeScript compiler
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting
```

## 🌐 API Integration

The application communicates with the JalanRusak backend API. Key endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /damaged-roads` - Create damage report
- `GET /damaged-roads` - List reports (with pagination/filtering)
- `GET /damaged-roads/:id` - Get report details
- `PUT /damaged-roads/:id/status` - Update report status (verificators only)

## 🔒 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes | `http://localhost:8080/api/v1` |

## 📱 Responsive Design

- **Mobile**: Optimized for smartphones with touch-friendly controls
- **Tablet**: Adaptive layout for medium screens
- **Desktop**: Full-featured interface with multi-column layouts

## 🐛 Troubleshooting

### Map not loading
- Check that Leaflet CSS is imported in `globals.css`
- Ensure the component is client-side (`'use client'` directive)
- Verify network connectivity

### Authentication errors
- Confirm backend API is running and accessible
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Clear browser localStorage and try again

### Type errors
- Run `pnpm type-check` to identify issues
- Ensure backend API types match the `types.ts` definitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a Pull Request

## 📄 License

MIT License - see LICENSE.md for details

## 🙏 Acknowledgments

- **Backend**: JalanRusak Go backend service
- **Maps**: OpenStreetMap contributors
- **Starter**: Based on [typescript-nextjs-starter](https://github.com/jpedroschmitz/typescript-nextjs-starter)

---

**JalanRusak** - Making Indonesian roads safer, one report at a time 🛣️

```
# pnpm
pnpm create next-app -e https://github.com/jpedroschmitz/typescript-nextjs-starter
# yarn
yarn create next-app -e https://github.com/jpedroschmitz/typescript-nextjs-starter
# npm
npx create-next-app -e https://github.com/jpedroschmitz/typescript-nextjs-starter
```

### Development

To start the project locally, run:

```bash
pnpm dev
```

Open `http://localhost:3000` with your browser to see the result.

## Testimonials

> [**“This starter is by far the best TypeScript starter for Next.js. Feature packed but un-opinionated at the same time!”**](https://github.com/jpedroschmitz/typescript-nextjs-starter/issues/87#issue-789642190)<br>
> — Arafat Zahan

> [**“I can really recommend the Next.js Typescript Starter repo as a solid foundation for your future Next.js projects.”**](https://corfitz.medium.com/create-a-custom-create-next-project-command-2a6b35a1c8e6)<br>
> — Corfitz

> [**“Brilliant work!”**](https://github.com/jpedroschmitz/typescript-nextjs-starter/issues/87#issuecomment-769314539)<br>
> — Soham Dasgupta

## Showcase

List of websites that started off with Next.js TypeScript Starter:

- [FreeInvoice.dev](https://freeinvoice.dev)
- [Notion Avatar Maker](https://github.com/Mayandev/notion-avatar)
- [IKEA Low Price](https://github.com/Mayandev/ikea-low-price)
- [hygraph.com](https://hygraph.com)
- [rocketseat.com.br](https://www.rocketseat.com.br)
- [vagaschapeco.com](https://vagaschapeco.com)
- [unfork.vercel.app](https://unfork.vercel.app)
- [cryptools.dev](https://cryptools.dev)
- [Add yours](https://github.com/jpedroschmitz/typescript-nextjs-starter/edit/main/README.md)

## Documentation

### Requirements

- Node.js >= 20
- pnpm 9

### Directory Structure

- [`.github`](.github) — GitHub configuration including the CI workflow.<br>
- [`.husky`](.husky) — Husky configuration and hooks.<br>
- [`public`](./public) — Static assets such as robots.txt, images, and favicon.<br>
- [`src`](./src) — Application source code, including pages, components, styles.

### Scripts

- `pnpm dev` — Starts the application in development mode at `http://localhost:3000`.
- `pnpm build` — Creates an optimized production build of your application.
- `pnpm start` — Starts the application in production mode.
- `pnpm type-check` — Validate code using TypeScript compiler.
- `pnpm lint` — Runs ESLint for all files in the `src` directory.
- `pnpm lint:fix` — Runs ESLint fix for all files in the `src` directory.
- `pnpm format` — Runs Prettier for all files in the `src` directory.
- `pnpm format:check` — Check Prettier list of files that need to be formatted.
- `pnpm format:ci` — Prettier check for CI.

### Path Mapping

TypeScript are pre-configured with custom path mappings. To import components or files, use the `@` prefix.

```tsx
import { Button } from '@/components/Button';
// To import images or other files from the public folder
import avatar from '@/public/avatar.png';
```

### Switch to Yarn/npm

This starter uses pnpm by default, but this choice is yours. If you'd like to switch to Yarn/npm, delete the `pnpm-lock.yaml` file, install the dependencies with Yarn/npm, change the CI workflow, and Husky Git hooks to use Yarn/npm commands.

> **Note:** If you use Yarn, make sure to follow these steps from the [Husky documentation](https://typicode.github.io/husky/troubleshoot.html#yarn-on-windows) so that Git hooks do not fail with Yarn on Windows.

### Environment Variables

We use [T3 Env](https://env.t3.gg/) to manage environment variables. Create a `.env.local` file in the root of the project and add your environment variables there.

When adding additional environment variables, the schema in `./src/lib/env/client.ts` or `./src/lib/env/server.ts` should be updated accordingly.

### Redirects

To add redirects, update the `redirects` array in `./redirects.ts`. It's typed, so you'll get autocompletion for the properties.

### CSP (Content Security Policy)

The Content Security Policy (CSP) is a security layer that helps to detect and mitigate certain types of attacks, including Cross-Site Scripting (XSS) and data injection attacks. The CSP is implemented in the `next.config.ts` file.

It contains a default and minimal policy that you can customize to fit your application needs. It's a foundation to build upon.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for more information.

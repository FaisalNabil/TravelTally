# Travel Tally

Split travel costs fairly — no spreadsheets, no awkward math.

## Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, PWA
- **Backend:** Express, MongoDB, Google Sign-In, JWT

## Local development

### Prerequisites

- Node.js 18+
- MongoDB

### Environment variables

**Server** (`server/.env`):

```env
MONGODB_URI=mongodb://localhost:27017/traveltally
PORT=3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret_min_32_chars
```

**Client** (`client/.env`):

```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Run

```bash
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
npm run dev
```

- API: http://localhost:3000
- Client dev server: http://localhost:5173 (proxies `/api` and `/auth`)

### Production build

```bash
npm run build
npm run start:prod
```

Serves the built SPA from `client/dist`.

## Deploy (Render)

Set in the Render dashboard:

| Variable | Notes |
|----------|-------|
| `MONGODB_URI` | MongoDB connection string |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `JWT_SECRET` | Dedicated JWT signing secret |
| `VITE_API_URL` | Your Render service URL (build-time) |
| `VITE_GOOGLE_CLIENT_ID` | Same as `GOOGLE_CLIENT_ID` (build-time) |
| `PORT` | Set by Render automatically |

## License

Proprietary — see repository owner.

## Contact

[tousif.md.amin.faisal@gmail.com](mailto:tousif.md.amin.faisal@gmail.com)

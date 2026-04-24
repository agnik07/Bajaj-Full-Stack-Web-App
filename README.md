# SRM Full Stack Engineering Challenge

Production-ready full stack project implementing:

- Backend REST API: `POST /bfhl` (Node.js + Express)
- Frontend SPA: React + Vite + Tailwind CSS
- Deployment-ready configuration for Render/Railway and Vercel/Netlify

## Folder Structure

```text
.
├── backend
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── utils
│   ├── app.js
│   ├── server.js
│   └── package.json
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Backend Setup

1. Navigate to backend:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env
   ```

4. Update `.env` values:

   - `USER_ID=fullname_ddmmyyyy`
   - `EMAIL_ID=yourcollegeemail`
   - `COLLEGE_ROLL_NUMBER=yourrollnumber`

5. Start backend:

   ```bash
   npm run dev
   ```

Backend runs at `http://localhost:5001`.

## Frontend Setup

1. Navigate to frontend:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env
   ```

4. Start frontend:

   ```bash
   npm run dev
   ```

Frontend runs at `http://localhost:5173`.

## Run From Root

Install all dependencies:

```bash
npm run install:all
```

Run backend:

```bash
npm run dev:backend
```

Run frontend:

```bash
npm run dev:frontend
```

## API Endpoint

### POST `/bfhl`

Request body:

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

Response shape:

```json
{
  "user_id": "johnsmith_17091999",
  "email_id": "john.smith@srmist.edu.in",
  "college_roll_number": "RA2311003012345",
  "hierarchies": [
    {
      "root": "A",
      "tree": {
        "A": {
          "B": {
            "D": {}
          },
          "C": {}
        }
      },
      "depth": 3
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

## Challenge Logic Coverage

- Strict node validation: `X->Y`, uppercase A-Z only
- Self-loop rejection (`A->A`)
- Duplicate edge detection (reported once)
- Multi-parent handling (first parent wins)
- Tree construction for disconnected components
- Cycle detection with cyclic-group response
- Lexicographical tie handling
- Depth calculation (longest root-to-leaf path node count)
- Summary fields as per challenge

## Deployment

## Backend (Render/Railway)

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables:
  - `PORT` (platform usually injects this)
  - `USER_ID`
  - `EMAIL_ID`
  - `COLLEGE_ROLL_NUMBER`

## Frontend (Vercel/Netlify)

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables:
  - `VITE_API_BASE_URL=https://your-backend-domain.com`

## Frontend Features

- Modern responsive glassmorphism UI
- Dark mode toggle
- Loading and error states
- Example autofill and reset
- Copy JSON response
- Toast notifications
- Visual tree renderer for hierarchies

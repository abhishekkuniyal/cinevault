# 🎬 CineVault

CineVault is an AI-powered media review platform built on the MERN stack, where users can browse movies and shows, write and manage reviews, and see aggregated ratings — all backed by real-time data from TMDB (The Movie Database).

---

## 📌 Features

- **User Authentication** — Secure JWT-based auth with tokens stored in httpOnly cookies (no localStorage, protected against XSS)
- **Movie & Media Data** — Integration with the TMDB API for up-to-date movie/show details, credits, and metadata
- **Reviews & Ratings** — Users can create, edit, and delete reviews for any media; ratings are aggregated automatically
- **One Review Per User Per Media** — Enforced via a compound unique index (no duplicate reviews)
- **Dynamic Rating Calculation** — Media average ratings update in real time as reviews are added/edited/removed
- **AI-Powered Enhancements** — (in progress) AI-assisted review summaries / recommendations

---

## 🛠️ Tech Stack

**Frontend**
- React
- Tailwind CSS
- Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT (JSON Web Tokens) for auth
- httpOnly cookies for token storage

**External APIs**
- TMDB API (movie/show data, credits)

---

## 📂 Project Structure

```
cinevault/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   │   └── tmdbService.js      # Axios wrapper for TMDB API calls
│   ├── utils/
│   │   └── updateMediaRating.js
│   ├── .env
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/ or store/
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🔐 Authentication Flow

- On login/register, the server signs a JWT with the user's `id` in the payload
- Token is set as an **httpOnly cookie**, inaccessible to client-side JS
- Protected routes use middleware that verifies the token and attaches the user to the request as `req.user`, destructured as:
  ```js
  const { id: userId } = req.user;
  ```

---

## 🎥 TMDB Integration

- Backend communicates with TMDB via **axios**, using a **Bearer token** (`TMDB_ACCESS_TOKEN`) for authentication
- Used to fetch movie/show details and credits (`fetchCredits(tmdbId)`)
- Environment variables are loaded from the `backend/.env` file

---

## ⭐ Review & Rating System

- Each review is tied to a specific user and media item
- A **compound unique index** on `(userId, mediaId)` ensures one review per user per media
- When a review is added, updated, or deleted, `updateMediaRating` recalculates the media's average rating using plain JS math (no external library)

---

## ⚙️ Environment Variables

Create a `.env` file inside `backend/` with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
TMDB_ACCESS_TOKEN=your_tmdb_bearer_token
NODE_ENV=development
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/abhishekkuniyal/cinevault.git
cd cinevault
```

### 2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Set up environment variables
Add the `.env` file in `backend/` as shown above.

### 4. Run the app
```bash
# Backend (from /backend)
npm run dev

# Frontend (from /frontend)
npm run dev
```

---

## 🗺️ Roadmap

- [x] User authentication (JWT + httpOnly cookies)
- [x] Movie/media backend
- [x] Review CRUD + rating aggregation
- [ ] Full TMDB integration (credits, search, trending)
- [ ] Frontend UI polish
- [ ] AI-powered review summaries
- [ ] Deployment (Render / Vercel / MongoDB Atlas)

---

## 👤 Author

**Abhishek Kuniyal**
GitHub: [@abhishekkuniyal](https://github.com/abhishekkuniyal)

---

## 📄 License

This project is licensed under the MIT License.

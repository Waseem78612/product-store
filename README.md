# Product Store — Axios + React Learning Project

## ▶️ Run with Bun

```bash
bun install
bun run dev
# → http://localhost:5173
```

## 📁 Structure

```
src/
├── hooks/
│   └── useProducts.js      ← axios API calls here
├── components/
│   ├── ProductCard.jsx     ← single product card
│   ├── SkeletonCard.jsx    ← loading placeholder
│   ├── SearchBar.jsx       ← search input
│   ├── CategoryFilter.jsx  ← category dropdown
│   └── SortSelect.jsx      ← sort dropdown
├── App.jsx                 ← filter + sort logic, grid
└── main.jsx
```

## 🧠 What You Learn

| Concept        | Where                     |
|----------------|---------------------------|
| axios.get()    | useProducts.js            |
| useEffect      | useProducts.js            |
| useState       | App.jsx                   |
| useMemo        | App.jsx (filtered list)   |
| useCallback    | App.jsx, SearchBar.jsx    |
| Custom hook    | useProducts.js            |
| .filter()      | App.jsx                   |
| .sort()        | App.jsx                   |
| Props          | All components            |
| Lazy loading   | ProductCard img           |
| Error handling | useProducts + App.jsx     |
| Skeleton UI    | SkeletonCard.jsx          |

## 🌐 API Used

- `GET /products?limit=100` — all products
- `GET /products/categories` — all categories

From [dummyjson.com](https://dummyjson.com) — free, no API key needed.

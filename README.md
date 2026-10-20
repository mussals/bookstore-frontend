# Bookstore Front End

CWEB 2136 Web Tooling – React front end for the [bookstore REST API](https://github.com/mussals/bookstore-api).

## Pages

- **Catalog** (`/`) – every book in the catalog shown as a card.
- **Management** (`/manage`) – a form to add or edit books, and a table of the whole catalog with Edit and Delete buttons on each row. The table reloads after every change.

The form won't submit if any field is empty or if price/quantity aren't valid numbers.

## Run it

1. Start the API first (`bookstore-api`, running on port 8080).
2. In this folder:

```
npm install
npm run dev
```

3. Open http://localhost:5173

The dev server forwards `/books` requests to `http://localhost:8080` (see `vite.config.js`), so the API doesn't need any CORS changes.

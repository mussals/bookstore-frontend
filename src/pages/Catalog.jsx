import { useEffect, useState } from 'react'
import { getBooks } from '../api.js'
import BookCard from '../components/BookCard.jsx'

export default function Catalog() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load the catalog every time this page is opened, so it always
  // reflects the latest changes made on the Management page.
  useEffect(() => {
    getBooks()
      .then(setBooks)
      .catch(() => setError('Could not load the catalog. Is the API running on port 8080?'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section>
      <h1>Catalog</h1>
      {loading && <p>Loading…</p>}
      {error && <p className="error-banner">{error}</p>}
      {!loading && !error && books.length === 0 && <p>The catalog is empty.</p>}

      <div className="card-grid">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  )
}

export default function BookCard({ book }) {
  const inStock = book.quantityInStock > 0

  return (
    <article className="book-card">
      <h2>{book.title}</h2>
      <p className="author">by {book.author}</p>
      <p className="isbn">ISBN {book.isbn}</p>
      <div className="card-footer">
        <span className="price">${Number(book.price).toFixed(2)}</span>
        <span className={inStock ? 'stock' : 'stock out'}>
          {inStock ? `${book.quantityInStock} in stock` : 'Out of stock'}
        </span>
      </div>
    </article>
  )
}

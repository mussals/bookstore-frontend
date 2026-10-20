import { useEffect, useState } from 'react'
import { createBook, deleteBook, getBooks, updateBook } from '../api.js'

const EMPTY_FORM = { title: '', author: '', isbn: '', price: '', quantityInStock: '' }

// Returns an object of error messages. An empty object means the form is valid.
function validate(form) {
  const errors = {}
  if (!form.title.trim()) errors.title = 'Title is required.'
  if (!form.author.trim()) errors.author = 'Author is required.'
  if (!form.isbn.trim()) errors.isbn = 'ISBN is required.'

  if (String(form.price).trim() === '') {
    errors.price = 'Price is required.'
  } else if (isNaN(Number(form.price)) || Number(form.price) < 0) {
    errors.price = 'Price must be a number of 0 or more.'
  }

  if (String(form.quantityInStock).trim() === '') {
    errors.quantityInStock = 'Quantity is required.'
  } else if (!Number.isInteger(Number(form.quantityInStock)) || Number(form.quantityInStock) < 0) {
    errors.quantityInStock = 'Quantity must be a whole number of 0 or more.'
  }
  return errors
}

export default function Management() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [apiError, setApiError] = useState('')

  // Reloads the table from the API. Called on page load and after every change.
  async function loadBooks() {
    try {
      setBooks(await getBooks())
      setApiError('')
    } catch {
      setApiError('Could not reach the API. Is it running on port 8080?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBooks()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: undefined }) // clear that field's error while typing
  }

  function resetForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setErrors({})
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      return // Missing or invalid values: do not send anything to the API.
    }

    const book = {
      title: form.title.trim(),
      author: form.author.trim(),
      isbn: form.isbn.trim(),
      price: Number(form.price),
      quantityInStock: Number(form.quantityInStock),
    }

    try {
      if (editingId === null) {
        await createBook(book)
        setMessage(`Added "${book.title}".`)
      } else {
        await updateBook(editingId, book)
        setMessage(`Updated "${book.title}".`)
      }
      resetForm()
      await loadBooks()
    } catch {
      setApiError('Saving failed. Check that the API is running and try again.')
    }
  }

  function handleEdit(book) {
    setEditingId(book.id)
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      price: String(book.price),
      quantityInStock: String(book.quantityInStock),
    })
    setErrors({})
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(book) {
    setMessage('')
    try {
      await deleteBook(book.id)
      if (editingId === book.id) resetForm()
      setMessage(`Deleted "${book.title}".`)
      await loadBooks()
    } catch {
      setApiError('Deleting failed. Check that the API is running and try again.')
    }
  }

  function field(name, label, type = 'text', extra = {}) {
    return (
      <label className="field">
        <span>{label}</span>
        <input
          name={name}
          type={type}
          value={form[name]}
          onChange={handleChange}
          className={errors[name] ? 'invalid' : ''}
          {...extra}
        />
        {errors[name] && <small className="field-error">{errors[name]}</small>}
      </label>
    )
  }

  return (
    <section>
      <h1>Management</h1>
      {apiError && <p className="error-banner">{apiError}</p>}

      <form className="book-form" onSubmit={handleSubmit} noValidate>
        <h2>{editingId === null ? 'Add a book' : `Edit book #${editingId}`}</h2>
        <div className="form-grid">
          {field('title', 'Title')}
          {field('author', 'Author')}
          {field('isbn', 'ISBN')}
          {field('price', 'Price ($)', 'number', { min: 0, step: '0.01' })}
          {field('quantityInStock', 'Quantity in stock', 'number', { min: 0, step: 1 })}
        </div>
        <div className="form-actions">
          <button type="submit" className="primary">
            {editingId === null ? 'Add book' : 'Save changes'}
          </button>
          {editingId !== null && (
            <button type="button" onClick={resetForm}>
              Cancel edit
            </button>
          )}
          {message && <span className="success">{message}</span>}
        </div>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className={book.id === editingId ? 'editing' : ''}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.isbn}</td>
                <td>${Number(book.price).toFixed(2)}</td>
                <td>{book.quantityInStock}</td>
                <td className="actions">
                  <button type="button" onClick={() => handleEdit(book)}>
                    Edit
                  </button>
                  <button type="button" className="danger" onClick={() => handleDelete(book)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && books.length === 0 && (
              <tr>
                <td colSpan="7" className="empty">No books in the catalog.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

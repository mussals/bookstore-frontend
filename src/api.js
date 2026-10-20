// All calls to the Spring Boot API live here.
const BASE_URL = '/books'

async function check(response) {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
  return response
}

export async function getBooks() {
  const response = await check(await fetch(BASE_URL))
  return response.json()
}

export async function createBook(book) {
  const response = await check(
    await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    }),
  )
  return response.json()
}

export async function updateBook(id, book) {
  const response = await check(
    await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    }),
  )
  return response.json()
}

export async function deleteBook(id) {
  await check(await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' }))
}

import { NavLink, Route, Routes } from 'react-router-dom'
import Catalog from './pages/Catalog.jsx'
import Management from './pages/Management.jsx'

export default function App() {
  return (
    <>
      <header className="site-header">
        <span className="brand">Bookstore</span>
        <nav>
          <NavLink to="/" end>Catalog</NavLink>
          <NavLink to="/manage">Management</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/manage" element={<Management />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </>
  )
}

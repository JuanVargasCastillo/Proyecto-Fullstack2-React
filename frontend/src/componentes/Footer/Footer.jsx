export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="container py-3">
        <div className="d-flex justify-content-between">
          <span>&copy; {new Date().getFullYear()} Tienda Virtual</span>
          <span className="text-secondary">Hecho con React + Bootstrap</span>
        </div>
      </div>
    </footer>
  )
}
export default function AdminFooter() {
  return (
    <footer className="footer bg-footer pt-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className="footer-title">Contacto</h5>
            <p>Email: <a href="mailto:GBunnyStore@tienda.com" className="footer-link">GBunnyStore@tienda.com</a></p>
            <p>Tel: +56 9 1234 5678</p>
            <p>Dirección: Av. Principal 123, Santiago</p>
          </div>
          <div className="col-md-4 mb-3">
            <h5 className="footer-title">Enlaces</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="footer-link">Nosotros</a></li>
              <li><a href="#" className="footer-link">Blog</a></li>
              <li><a href="#" className="footer-link">Contáctanos</a></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5 className="footer-title">Síguenos</h5>
            <a href="#" className="footer-social me-2" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
            <a href="#" className="footer-social me-2" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
            <a href="#" className="footer-social me-2" aria-label="Twitter"><i className="bi bi-twitter"></i></a>
          </div>
        </div>
        <div className="text-center mt-3">
          <small className="footer-copy">&copy; 2025 Green Bunny Store — Todos los derechos reservados 🐰💚</small>
        </div>
      </div>
    </footer>
  )
}
export default function Contacto() {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h4 className="mb-3">Contacto</h4>
              <p className="text-muted">Para consultas, escribinos a <a href="mailto:soporte@tienda.com">soporte@tienda.com</a>.</p>
              <form>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input className="form-control" placeholder="Tu nombre" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" placeholder="tu@email.com" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mensaje</label>
                  <textarea className="form-control" rows="4" placeholder="Cómo podemos ayudarte?" />
                </div>
                <button type="button" className="btn btn-primary" disabled>Enviar (demo)</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
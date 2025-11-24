import { Link } from 'react-router-dom'
import '../../assets/styles/nosotros.css'

export default function Nosotros() {
  return (
    <section className="section-nosotros">
      <div className="container">
        <img src="/img/logo.png" alt="Logo Green Bunny Store" className="logo-nosotros" />
        <h1 className="text-bunny mb-3">Green Bunny Store</h1>
        <p className="lead mx-auto" style={{ maxWidth: 700 }}>
          En Green Bunny Store nos apasiona el reciclaje y la moda sostenible. Nuestro objetivo es ofrecer productos únicos,
          amigables con el medio ambiente, y al mismo tiempo apoyar a la comunidad y a pequeños productores locales.
          Cada compra que realizas contribuye a un planeta más verde y un estilo de vida consciente.
        </p>

        <div className="desarrolladores">
          <h2 className="text-bunny mb-4">Desarrolladores</h2>
          <div className="row justify-content-center g-4">
            <div className="col-md-3 col-sm-6">
              <div className="dev-card">
                <img src="/img/dev1.png" alt="Desarrollador 1" />
                <div className="dev-name">Matilda Vargas</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="dev-card">
                <img src="/img/dev2.png" alt="Desarrollador 2" />
                <div className="dev-name">Juan Vargas</div>
              </div>
            </div>
          </div>
        </div>

        <Link to="/" className="btn btn-bunny mt-4">Volver a la tienda</Link>
      </div>
    </section>
  )
}
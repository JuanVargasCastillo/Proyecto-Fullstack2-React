import { useCart } from '../../context/CartContext'
import { Link } from 'react-router-dom'

export default function ProductCard({ producto }) {
  const { add } = useCart()
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  const img = producto?.imagenUrl ? base + producto.imagenUrl : ''
  const precio = Number(producto?.precio || 0)

  return (
    <div className="card h-100">
      <Link to={`/producto/${producto?.id}`} className="text-decoration-none">
        <img src={img} className="card-img-top producto-img" alt={producto?.nombre} />
      </Link>
      <div className="card-body text-center d-flex flex-column align-items-center">
        <Link to={`/producto/${producto?.id}`} className="text-decoration-none">
          <h5 className="card-title">{producto?.nombre}</h5>
        </Link>
        <p className="card-text mb-2">${new Intl.NumberFormat('es-CL').format(precio)}</p>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-verde-pastel" onClick={() => add(producto.id, 1)}>Agregar</button>
          <button className="btn btn-sm btn-rosa-pastel add-fav"><i className="bi bi-heart"></i></button>
        </div>
      </div>
    </div>
  )
}
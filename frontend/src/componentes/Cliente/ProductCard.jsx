import { useCart } from '../../context/CartContext'

export default function ProductCard({ producto }) {
  const { add } = useCart()
  const img = producto?.imagenUrl || ''
  const precio = Number(producto?.precio || 0)

  return (
    <div className="card h-100">
      <img src={img} className="card-img-top producto-img" alt={producto?.nombre} />
      <div className="card-body text-center d-flex flex-column align-items-center">
        <h5 className="card-title">{producto?.nombre}</h5>
        <p className="card-text mb-2">${new Intl.NumberFormat('es-CL').format(precio)}</p>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-primary" onClick={() => add(producto.id, 1)}>Agregar</button>
          <button className="btn btn-sm btn-outline-danger add-fav"><i className="bi bi-heart"></i></button>
        </div>
      </div>
    </div>
  )
}
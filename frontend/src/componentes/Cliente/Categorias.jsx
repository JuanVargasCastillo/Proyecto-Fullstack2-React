import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { listarCategorias } from '../../services/categorias'
import ProductGrid from './ProductGrid'
import '../../assets/styles/categorias.css'

export default function Categorias() {
  const location = useLocation()
  const [categorias, setCategorias] = useState([])
  const [titulo, setTitulo] = useState('Productos')

  useEffect(() => {
    listarCategorias().then(setCategorias).catch(() => {})
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const categoriaId = params.get('categoriaId')
    if (!categoriaId) {
      setTitulo('Todos los productos')
      return
    }
    const c = categorias.find((x) => String(x.id) === String(categoriaId))
    if (c) setTitulo(`Categoría: ${c.nombre}`)
    else setTitulo('Productos')
  }, [location.search, categorias])

  return (
    <ProductGrid title={titulo} />
  )
}
import CategoryOffcanvas from '../../componentes/Cliente/CategoryOffcanvas'
import Carousel from '../../componentes/Cliente/Carousel'
import ProductGrid from '../../componentes/Cliente/ProductGrid'
import CartDrawer from '../../componentes/Cliente/CartDrawer'
import CartOverlay from '../../componentes/Cliente/CartOverlay'

export default function HomeCliente() {
  return (
    <>
      <CategoryOffcanvas />
      <Carousel />
      <ProductGrid />
      <CartDrawer />
      <CartOverlay />
    </>
  )
}
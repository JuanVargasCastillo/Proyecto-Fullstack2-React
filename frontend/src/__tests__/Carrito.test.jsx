import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Carrito from '../pages/Cliente/Carrito'

jest.mock('../context/CartContext', () => {
  const React = require('react')
  const ctx = React.createContext(null)
  return {
    useCart: () => React.useContext(ctx),
    CartContext: ctx,
    CartProvider: ({ children, value }) => <ctx.Provider value={value}>{children}</ctx.Provider>
  }
})

jest.mock('../services/api', () => ({
  default: { defaults: { baseURL: 'http://localhost:8080' } }
}))

describe('Carrito - agregar producto', () => {
  test('actualiza cantidad total y total del carrito al incrementar', () => {
    const CartMock = require('../context/CartContext')
    function StatefulProvider({ children }) {
      const React = require('react')
      const [cart, setCart] = React.useState({ items: [{ id: 1, productoId: 10, nombre: 'Polera', cantidad: 1, precioUnitario: 5000, totalLinea: 5000 }] })
      const inc = (id) => {
        setCart((c) => {
          const items = c.items.map((i) => i.id === id ? { ...i, cantidad: i.cantidad + 1, totalLinea: (i.cantidad + 1) * i.precioUnitario } : i)
          return { ...c, items }
        })
      }
      const value = { cart, inc, dec: () => {}, remove: () => {} }
      return <CartMock.CartProvider value={value}>{children}</CartMock.CartProvider>
    }
    render(
      <MemoryRouter>
        <StatefulProvider>
          <Carrito />
        </StatefulProvider>
      </MemoryRouter>
    )

    const brutoEl = document.getElementById('totalBruto')
    expect(brutoEl).toBeTruthy()
    expect(brutoEl.textContent.replace(/\s+/g, '')).toBe('$5.000')
    const countEl0 = document.getElementById('cantProd')
    expect(countEl0.textContent).toBe('1')

    const plusButtons = screen.getAllByText('+')
    fireEvent.click(plusButtons[0])

    // Después de incrementar, la UI debe reflejar 2 unidades y $10.000
    const brutoEl2 = document.getElementById('totalBruto')
    expect(brutoEl2.textContent.replace(/\s+/g, '')).toBe('$10.000')
    // verifica cantidad total
    const countEl = document.getElementById('cantProd')
    expect(countEl.textContent).toBe('2')
  })
})
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Checkout from '../pages/Cliente/Checkout'
import React from 'react'

jest.mock('../services/boletas', () => ({
  generarBoletaConEnvio: jest.fn(async () => ({ id: 99 }))
}))

jest.mock('../context/CartContext', () => {
  const React = require('react')
  const ctx = React.createContext(null)
  return {
    useCart: () => React.useContext(ctx),
    CartContext: ctx,
    CartProvider: ({ children, value }) => <ctx.Provider value={value}>{children}</ctx.Provider>
  }
})

function renderWithCart(cart, coupon) {
  if (coupon) localStorage.setItem('cupon', coupon)
  const value = { cart, empty: jest.fn(), refresh: jest.fn() }
  return render(
    <MemoryRouter>
      {(() => {
        const CartMock = require('../context/CartContext')
        return <CartMock.CartProvider value={value}><Checkout /></CartMock.CartProvider>
      })()}
    </MemoryRouter>
  )
}

describe('Checkout - aplicación de cupón', () => {
  test('CLUB10 aplica 10% descuento y recalcula IVA y total', () => {
    const cart = { items: [{ id: 1, nombre: 'Polera', cantidad: 1, totalLinea: 10000 }] }
    renderWithCart(cart, 'CLUB10')

    // Subtotal con descuento: 9000
    expect(screen.getByText('$9.000')).toBeInTheDocument()
    // IVA esperado: 9000 - round(9000/1.19) => 1437
    expect(screen.getByText('$1.437')).toBeInTheDocument()
    // Envío: 3000 por ser <=20000
    expect(screen.getByText('$3.000')).toBeInTheDocument()
    // Total: 9000 + 3000 = 12000
    expect(screen.getByText('$12.000')).toBeInTheDocument()
  })

  test('BIENVENIDA5 aplica 5% descuento y recalcula', () => {
    const cart = { items: [{ id: 1, nombre: 'Polera', cantidad: 1, totalLinea: 10000 }] }
    renderWithCart(cart, 'BIENVENIDA5')

    // Subtotal con descuento: 9500
    expect(screen.getByText('$9.500')).toBeInTheDocument()
    // IVA aproximado con redondeo
    const neto = Math.round(9500 / 1.19)
    const iva = Math.round(9500 - neto)
    const formattedIva = new Intl.NumberFormat('es-CL').format(iva)
    expect(screen.getByText(`$${formattedIva}`)).toBeInTheDocument()
    // Envío: 3000
    expect(screen.getByText('$3.000')).toBeInTheDocument()
    // Total: 9500 + 3000 = 12500
    expect(screen.getByText('$12.500')).toBeInTheDocument()
  })
})
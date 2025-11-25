import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Boleta from '../pages/Cliente/Boleta'

jest.mock('../services/boletas', () => ({
  obtenerBoleta: jest.fn(async (id) => ({
    id,
    correlativo: 1234,
    creadoEn: new Date('2025-01-15T12:00:00Z').toISOString(),
    subtotal: 9000,
    descuento: 1000,
    codigoCupon: 'CLUB10',
    neto: 7563,
    iva: 1437,
    costoEnvio: 3000,
    total: 12000,
    detalles: [{ nombre: 'Polera', cantidad: 2, totalLinea: 10000 }]
  }))
}))

describe('Boleta - muestra Subtotal, IVA y Total', () => {
  test('renderiza valores calculados', async () => {
    render(
      <MemoryRouter initialEntries={["/boleta/1"]}>
        <Routes>
          <Route path="/boleta/:id" element={<Boleta />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.getByText(/Boleta #1234/)).toBeInTheDocument())
    expect(screen.getByText('$9.000')).toBeInTheDocument() // subtotal con descuento
    expect(screen.getByText(/Descuento \(CLUB10\)/)).toBeInTheDocument()
    expect(screen.getByText('-$1.000')).toBeInTheDocument()
    expect(screen.getByText('$7.563')).toBeInTheDocument() // neto
    expect(screen.getByText('$1.437')).toBeInTheDocument() // iva
    expect(screen.getByText('$3.000')).toBeInTheDocument() // envío
    expect(screen.getByText('$12.000')).toBeInTheDocument() // total
  })
})
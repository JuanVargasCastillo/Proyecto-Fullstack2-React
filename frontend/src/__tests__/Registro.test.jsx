import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Registro from '../pages/Cliente/Registro'

jest.mock('../services/api', () => ({
  default: { post: jest.fn(async () => ({})) }
}))

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login: jest.fn(async () => ({ id: 1 })) })
}))

describe('Registro - validación de correo y contraseña', () => {
  test('muestra error para dominios inválidos y acepta dominios permitidos', () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    )

    const emailInput = screen.getByLabelText('Correo electrónico:')

    fireEvent.change(emailInput, { target: { value: 'user@yahoo.com' } })
    expect(screen.getByText(/Correo inválido\. Solo se aceptan:/i)).toBeInTheDocument()

    fireEvent.change(emailInput, { target: { value: 'user@gmail.com' } })
    expect(screen.queryByText(/Correo inválido\. Solo se aceptan:/i)).not.toBeInTheDocument()

    fireEvent.change(emailInput, { target: { value: 'user@hotmail.com' } })
    expect(screen.queryByText(/Correo inválido\. Solo se aceptan:/i)).not.toBeInTheDocument()

    fireEvent.change(emailInput, { target: { value: 'user@duocuc.cl' } })
    expect(screen.queryByText(/Correo inválido\. Solo se aceptan:/i)).not.toBeInTheDocument()

    fireEvent.change(emailInput, { target: { value: 'user@duoc.profesor.cl' } })
    expect(screen.queryByText(/Correo inválido\. Solo se aceptan:/i)).not.toBeInTheDocument()
  })

  test('fuerza de contraseña: Débil, Media, Fuerte', () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    )

    const passInput = screen.getByLabelText('Contraseña:')

    fireEvent.change(passInput, { target: { value: 'abc' } })
    expect(screen.getByText('Débil')).toBeInTheDocument()

    fireEvent.change(passInput, { target: { value: 'abcdefghij' } })
    expect(screen.getByText('Media')).toBeInTheDocument()

    fireEvent.change(passInput, { target: { value: 'Abcdefghij' } })
    expect(screen.getByText('Fuerte')).toBeInTheDocument()
  })
})
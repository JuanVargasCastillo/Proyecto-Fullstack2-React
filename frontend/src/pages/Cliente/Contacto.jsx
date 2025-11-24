import { useState } from 'react'
import '../../assets/styles/contacto.css'
import { enviarContacto } from '../../services/contacto'

export default function Contacto() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [okMsg, setOkMsg] = useState('')
  const [errMsg, setErrMsg] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setOkMsg('')
    setErrMsg('')
    try {
      await enviarContacto({ nombre, email, mensaje })
      setOkMsg('Gracias por contactarnos, pronto responderemos tu mensaje ❤️')
      setNombre('')
      setEmail('')
      setMensaje('')
    } catch (err) {
      setErrMsg('Ocurrió un error al enviar tu mensaje')
    }
  }

  return (
    <div className="container contacto-container">
      <img src="/img/logo.png" alt="Logo GBunny Store" />
      <h2>Contáctanos</h2>
      <form id="formContacto" onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre completo</label>
          <input type="text" className="form-control" id="nombre" placeholder="Tu nombre completo" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo electrónico</label>
          <input type="email" className="form-control" id="email" placeholder="tu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="mensaje" className="form-label">Descripción</label>
          <textarea className="form-control" id="mensaje" rows={4} placeholder="Escribe tu mensaje aquí..." required value={mensaje} onChange={(e) => setMensaje(e.target.value)}></textarea>
        </div>
        <button type="submit" className="btn btn-enviar">Enviar</button>
        {okMsg ? <div className="mt-3 text-success fw-bold">{okMsg}</div> : null}
        {errMsg ? <div className="mt-3 text-danger fw-bold">{errMsg}</div> : null}
      </form>
    </div>
  )
}
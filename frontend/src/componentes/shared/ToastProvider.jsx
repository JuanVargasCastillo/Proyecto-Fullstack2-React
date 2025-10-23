import { createContext, useContext, useState } from 'react'

const ToastContext = createContext({ show: () => {} })

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  function show(message, variant = 'success', timeout = 3000) {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, timeout)
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
        {toasts.map((t) => (
          <div key={t.id} className={`alert alert-${t.variant} shadow`} role="alert">
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
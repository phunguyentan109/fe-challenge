import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import './style.css'

const rootElement = document.querySelector<HTMLDivElement>('#app')

if (!rootElement) {
  throw new Error('Root element #app was not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

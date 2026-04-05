import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n/i18n'
import './theme/global.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div />}>
      <App />
    </Suspense>
  </StrictMode>,
)

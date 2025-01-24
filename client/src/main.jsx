import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'rsuite/dist/rsuite.min.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
createRoot(document.getElementById('react-app')).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>,
)

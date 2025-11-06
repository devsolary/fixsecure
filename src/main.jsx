import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppKitProvider } from "./AppKitProvider";
import './index.css'
import App from './App.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppKitProvider>      
    <BrowserRouter>
        <App />
    </BrowserRouter>
    </AppKitProvider>
  </StrictMode>,
)

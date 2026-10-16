import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Every load/refresh starts at the top (Hero): no browser scroll restoration and no jump to a
// leftover #hash (e.g. #contact from an earlier navbar click). In-app hash links still work:
// they go through the router after this point.
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
if (window.location.hash) {
  window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search)
}
window.scrollTo(0, 0)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

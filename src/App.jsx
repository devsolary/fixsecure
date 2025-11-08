import './App.css'
import Home from './pages/Home'
import { AppKitProvider } from './AppKitProvider'

function App() {


  return (
    <>
    <AppKitProvider>
              <Home />
    </AppKitProvider>

    </>
  )
}

export default App

import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import CreateEvent from './pages/CreateEvent'
import EventCards from "./pages/EventCards.tsx";
import Header from "./components/Header";

function App() { 

  return (
      <>
          <Header/>
          <BrowserRouter>
              <Routes>
                  <Route path="events/create" element={<CreateEvent />} />
                  <Route path="events" element={<EventCards />} />
                  <Route
                      path="*"
                      element={<Navigate to="/events/create" replace />}
                  />
              </Routes>
          </BrowserRouter>
      </>

  )
}

export default App

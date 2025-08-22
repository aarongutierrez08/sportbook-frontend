import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import CreateEvent from './pages/CreateEvent'

function App() { 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="events/create" element={<CreateEvent />} />
        <Route
          path="*"
          element={<Navigate to="/events/create" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

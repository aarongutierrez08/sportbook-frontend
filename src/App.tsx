import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import CreateEvent from './pages/CreateEvent'
import EventCards from "./pages/EventCards.tsx";
import Layout from "./components/layout.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="events/create" element={<CreateEvent />} />
                    <Route path="events" element={<EventCards />} />
                    <Route
                        path="*"
                        element={<Navigate to="/events/create" replace />}/>
                </Route>
            </Routes>
        </BrowserRouter>
);
}

export default App

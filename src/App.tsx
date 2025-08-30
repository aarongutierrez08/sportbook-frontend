import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import CreateEventPage from "./pages/CreateEventPage.tsx";
import EventCardsPage from "./pages/EventCardsPage.tsx";
import Layout from "./components/layout.tsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="events/create" element={<CreateEventPage />} />
            <Route path="events" element={<EventCardsPage />} />
            <Route path="*" element={<Navigate to="/events" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          removeDelay: 500,
        }}
      />
    </>
  );
}

export default App;

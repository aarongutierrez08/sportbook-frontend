import CreateEventPage from "./pages/CreateEventPage.tsx";
import EventCardsPage from "./pages/EventCardsPage.tsx";
import Layout from "./commons/components/layout.tsx";
import { Toaster } from "react-hot-toast";
import AuthPage from "./pages/AuthPage.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import RequireAuth from "./commons/components/RequiereAuth.tsx";
import { Navigate } from "react-router";
import EventPage from "./pages/EventPage/EventPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="auth" element={<AuthPage />} />

            <Route element={<RequireAuth />}>
              <Route path="events" element={<EventCardsPage />} />
              <Route path="events/create" element={<CreateEventPage />} />
              <Route path="events/:id" element={<EventPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

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

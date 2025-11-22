import Layout from "./commons/components/layout";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProfilePictureProvider } from "./auth/ProfilePictureContext";
import ActiveEventsPage from "./pages/events/ActiveEventsPage.tsx";
import RequireAuth from "./auth/RequireAuth";
import AuthPage from "./pages/auth/AuthPage.tsx";
import FinishedEventsPage from "./pages/finished/FinishedEventsPage.tsx";
import CreateEventPage from "./pages/create/CreateEventPage.tsx";
import EventPage from "./pages/event/EventPage.tsx";
import ProfilePage from "./pages/sport-profiles/ProfilePage.tsx";
import MyDataPage from "./pages/profile/MyDataPage.tsx";

function App() {
  return (
    <>
      <AuthProvider>
        <ProfilePictureProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="auth" element={<AuthPage />} />

                <Route element={<RequireAuth />}>
                  <Route path="events" element={<ActiveEventsPage />} />
                  <Route
                    path="events/finished"
                    element={<FinishedEventsPage />}
                  />
                  <Route path="events/create" element={<CreateEventPage />} />
                  <Route path="events/:id" element={<EventPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="my-data" element={<MyDataPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/events" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ProfilePictureProvider>
      </AuthProvider>

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

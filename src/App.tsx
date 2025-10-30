import CreateEventPage from "./pages/CreateEventPage";
import ActiveEventsPage from "./pages/ActiveEventsPage";
import FinishedEventsPage from "./pages/FinishedEventsPage";
import Layout from "./commons/components/layout";
import { Toaster } from "react-hot-toast";
import AuthPage from "./pages/AuthPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EventPage from "./pages/EventPage/EventPage";
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider } from "./auth/AuthContext";
import { ProfilePictureProvider } from "./auth/ProfilePictureContext";
import MyDataPage from "./pages/MyDataPage.tsx";
import RequireAuth from "./auth/RequireAuth";

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

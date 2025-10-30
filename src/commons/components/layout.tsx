import Header from "./Header";
import { Outlet } from "react-router";

const Layout: React.FC = () => {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

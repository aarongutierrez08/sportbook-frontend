import Header from "./Header.tsx";
import { Outlet } from "react-router";

const Layout: React.FC = () => {
  return (
    <div>
      <Header />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

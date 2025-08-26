import Header from "./header.tsx";
import {Outlet} from "react-router";

const Layout: React.FC = () => {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    );
};

export default Layout;
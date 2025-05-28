import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <div style={{ marginLeft: "250px", padding: "2rem", background: "0d1b2a", minHeight: "100vh", width: "100%" }}>
                <Outlet />
            </div>
        </div>
    );
}
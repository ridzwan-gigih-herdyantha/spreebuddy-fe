import { Outlet, useNavigate } from "react-router-dom";
import AppNavbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ footer = true }) {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar onStartChat={() => navigate("/chat")} />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      {footer && <Footer />}
    </div>
  );
}

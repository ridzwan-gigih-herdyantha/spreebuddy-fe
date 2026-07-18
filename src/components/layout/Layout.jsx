import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppNavbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar
        user={{ name: "Rani" }}
        onStartChat={() => navigate("/chat")}
        onSearch={(q) => setQuery(q)}
      />
      <main className="flex-grow-1">
        <Outlet context={{ query }} />
      </main>
      <Footer />
    </div>
  );
}

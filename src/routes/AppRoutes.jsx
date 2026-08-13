import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import StyleGuide from "@/pages/StyleGuide";
import ComingSoon from "@/pages/ComingSoon";
import Maintenance from "@/pages/Maintenance";
import ServerError from "@/pages/ServerError";
import NotFound from "@/pages/NotFound";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Wishlist from "@/pages/Wishlist";
import Chat from "@/pages/Chat";
import Orders from "@/pages/Orders";
import { placeholderRoutes } from "@/config/navigation";
import {
  maintenanceMode,
  previewPagesEnabled,
  previewRoutes,
  statusRoutes,
} from "@/config/features";

export default function AppRoutes() {
  if (maintenanceMode) {
    return (
      <Routes>
        <Route path="*" element={<Maintenance brand />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route
          path={previewRoutes.styleGuide}
          element={
            previewPagesEnabled ? <StyleGuide /> : <Navigate to="/" replace />
          }
        />

        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/chat" element={<Chat />} />

        <Route path="/orders" element={<Orders />} />

        {["/account", "/settings"].map((path) => (
          <Route key={path} path={path} element={<ComingSoon />} />
        ))}

        {placeholderRoutes
          .filter(
            (path) =>
              path !== "/shop" && path !== "/wishlist" && path !== "/chat",
          )
          .map((path) => (
            <Route key={path} path={path} element={<ComingSoon />} />
          ))}

        <Route path={statusRoutes.serverError} element={<ServerError />} />
        <Route path={statusRoutes.maintenance} element={<Maintenance />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

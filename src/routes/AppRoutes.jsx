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

        {placeholderRoutes
          .filter((path) => path !== "/shop")
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

import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import StyleGuide from "../pages/StyleGuide";
import NotFound from "../pages/NotFound";
import { previewPagesEnabled, previewRoutes } from "../config/features";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route
          path={previewRoutes.styleGuide}
          element={
            previewPagesEnabled ? <StyleGuide /> : <Navigate to="/" replace />
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

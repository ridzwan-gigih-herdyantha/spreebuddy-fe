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
import ChatHistory from "@/pages/ChatHistory";
import Orders from "@/pages/Orders";
import OrderDetail from "@/pages/OrderDetail";
import Account from "@/pages/Account";
import AccountSettings from "@/pages/AccountSettings";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminChatSessions from "@/pages/admin/AdminChatSessions";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminOrderDetail from "@/pages/admin/AdminOrderDetail";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminProductDetail from "@/pages/admin/AdminProductDetail";
import AdminProductForm from "@/pages/admin/AdminProductForm";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminUserDetail from "@/pages/admin/AdminUserDetail";
import AdminUserForm from "@/pages/admin/AdminUserForm";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminSettings from "@/pages/admin/AdminSettings";
import Dashboard from "@/pages/admin/Dashboard";
import { adminRoutes } from "@/config/admin";
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

      <Route path={adminRoutes.login} element={<AdminLogin />} />

      <Route path={adminRoutes.dashboard} element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/:slug" element={<AdminProductDetail />} />
        <Route path="products/:slug/edit" element={<AdminProductForm />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetail />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:id" element={<AdminUserDetail />} />
        <Route path="users/:id/edit" element={<AdminUserForm />} />
        <Route path="chat-sessions" element={<AdminChatSessions />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route element={<Layout footer={false} />}>
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat-history" element={<ChatHistory />} />
      </Route>

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route
          path={previewRoutes.styleGuide}
          element={
            previewPagesEnabled ? <StyleGuide /> : <Navigate to="/" replace />
          }
        />

        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />

        <Route path="/account" element={<Account />} />
        <Route path="/settings" element={<AccountSettings />} />

        {placeholderRoutes
          .filter(
            (path) =>
              path !== "/shop" &&
              path !== "/wishlist" &&
              path !== "/chat" &&
              path !== "/chat-history",
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

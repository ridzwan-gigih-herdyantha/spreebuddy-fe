import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./context/AuthContext";
import CartProvider from "./context/CartContext";
import ToastProvider from "./context/ToastProvider";
import AppRoutes from "./routes/AppRoutes";
import RouteEffects from "./components/layout/RouteEffects";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RouteEffects />
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <AppRoutes />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

import { createContext } from "react";

export const ToastContext = createContext({
  show: () => {},
  success: () => {},
  error: () => {},
  info: () => {},
  dismiss: () => {},
});

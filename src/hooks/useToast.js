import { useContext } from "react";
import { ToastContext } from "@/context/toastStore";

export const useToast = () => useContext(ToastContext);

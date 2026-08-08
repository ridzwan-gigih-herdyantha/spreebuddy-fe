import StatusPage from "@/components/ui/StatusPage";
import MaintenanceArt from "@/assets/ui/WebUnderConstructionLottie.svg?react";
import { maintenanceStatus } from "@/data/status";

export default function Maintenance({ brand = false }) {
  return (
    <StatusPage
      status={maintenanceStatus}
      art={<MaintenanceArt />}
      brand={brand}
    />
  );
}

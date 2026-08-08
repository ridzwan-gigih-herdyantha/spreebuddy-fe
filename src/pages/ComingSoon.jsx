import { useLocation } from "react-router-dom";
import StatusPage from "@/components/ui/StatusPage";
import { navLabels } from "@/config/navigation";
import MaintenanceArt from "@/assets/ui/WebUnderConstructionLottie.svg?react";
import { comingSoonStatus } from "@/data/status";

export default function ComingSoon() {
  const { pathname } = useLocation();
  const label = navLabels[pathname];

  return (
    <StatusPage
      status={{
        ...comingSoonStatus,
        title: label ? `${label} is on the way` : comingSoonStatus.title,
      }}
      art={<MaintenanceArt />}
    />
  );
}

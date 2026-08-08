import StatusPage from "@/components/ui/StatusPage";
import NotFoundArt from "@/assets/ui/NotFoundLottie.svg?react";
import { notFoundStatus } from "@/data/status";

export default function NotFound() {
  return <StatusPage status={notFoundStatus} art={<NotFoundArt />} />;
}

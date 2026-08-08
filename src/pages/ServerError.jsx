import StatusPage from "@/components/ui/StatusPage";
import { serverErrorStatus } from "@/data/status";

export default function ServerError() {
  return <StatusPage status={serverErrorStatus} />;
}

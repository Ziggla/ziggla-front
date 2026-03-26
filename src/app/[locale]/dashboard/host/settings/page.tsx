import DashboardShell from "@/components/layout/DashboardShell";
import ComingSoon from "@/components/dashboard/ComingSoon";

export default function HostSettingsPage() {
  return (
    <DashboardShell role="host" activeItem="settings">
      <ComingSoon backHref="/dashboard/host" backLabel="Back to Dashboard" />
    </DashboardShell>
  );
}

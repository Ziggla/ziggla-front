import DashboardShell from "@/components/layout/DashboardShell";
import ComingSoon from "@/components/dashboard/ComingSoon";

export default function AdminSettingsPage() {
  return (
    <DashboardShell role="admin" activeItem="settings">
      <ComingSoon backHref="/dashboard/admin" backLabel="Back to Dashboard" />
    </DashboardShell>
  );
}

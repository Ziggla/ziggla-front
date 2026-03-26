import DashboardShell from "@/components/layout/DashboardShell";
import ComingSoon from "@/components/dashboard/ComingSoon";

export default function AdminUsersPage() {
  return (
    <DashboardShell role="admin" activeItem="users">
      <ComingSoon backHref="/dashboard/admin" backLabel="Back to Dashboard" />
    </DashboardShell>
  );
}

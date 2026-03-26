import DashboardShell from "@/components/layout/DashboardShell";
import ComingSoon from "@/components/dashboard/ComingSoon";

export default function AdminPaymentsPage() {
  return (
    <DashboardShell role="admin" activeItem="payments">
      <ComingSoon backHref="/dashboard/admin" backLabel="Back to Dashboard" />
    </DashboardShell>
  );
}

import DashboardShell from "@/components/layout/DashboardShell";
import ComingSoon from "@/components/dashboard/ComingSoon";

export default function AdminAnalyticsPage() {
  return (
    <DashboardShell role="admin" activeItem="analytics">
      <ComingSoon backHref="/dashboard/admin" backLabel="Back to Dashboard" />
    </DashboardShell>
  );
}

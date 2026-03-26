import DashboardShell from "@/components/layout/DashboardShell";
import ComingSoon from "@/components/dashboard/ComingSoon";

export default function AdminBookingsPage() {
  return (
    <DashboardShell role="admin" activeItem="allBookings">
      <ComingSoon backHref="/dashboard/admin" backLabel="Back to Dashboard" />
    </DashboardShell>
  );
}

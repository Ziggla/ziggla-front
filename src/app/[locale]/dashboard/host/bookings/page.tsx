import DashboardShell from "@/components/layout/DashboardShell";
import ComingSoon from "@/components/dashboard/ComingSoon";

export default function HostBookingsPage() {
  return (
    <DashboardShell role="host" activeItem="bookings">
      <ComingSoon backHref="/dashboard/host" backLabel="Back to Dashboard" />
    </DashboardShell>
  );
}

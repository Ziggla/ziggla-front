import DashboardShell from "@/components/layout/DashboardShell";
import ComingSoon from "@/components/dashboard/ComingSoon";

export default function HostPayoutsPage() {
  return (
    <DashboardShell role="host" activeItem="payouts">
      <ComingSoon backHref="/dashboard/host" backLabel="Back to Dashboard" />
    </DashboardShell>
  );
}

import { AppShell } from "@/components/AppShell";
import { Outlet } from "react-router";

export default function Dashboard() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

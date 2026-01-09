import Sidebar from "../components/sidebar";
import { Outlet } from "react-router-dom";
import ProfileHeader from "../components/header";
export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <ProfileHeader />
      <div className="flex flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

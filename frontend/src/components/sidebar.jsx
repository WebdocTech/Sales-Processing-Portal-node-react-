import { Home, User, Settings, FileText, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation

export default function Sidebar() {
  return (
    <div className="w-28 lg:w-56 bg-white text-black flex flex-col shadow-xl border-r border-r-gray-300">
      {/* Menu Items */}
      <nav className="flex-1 px-2 lg:px-5 pt-10 space-y-3">
        <SidebarItem
          icon={<Home className="h-4 lg:h-6 w-4 lg:w-6" />}
          label="Dashboard"
          to="/dashboard"
        />
        {/* <SidebarItem icon={<User size={18} />} label="Profile" to="/profile" /> */}
        <SidebarItem
          icon={<FileText className="h-4 lg:h-6 w-4 lg:w-6" />}
          label="Documents"
          to="/docs"
        />
        {/* <SidebarItem
          icon={<Settings size={18} />}
          label="Settings"
          to="/settings"
        /> */}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-gray-300">
        <button className="w-full" onClick={() => sessionStorage.clear()}>
          <SidebarItem
            icon={<LogOut className="h-4 lg:h-6 w-4 lg:w-6" />}
            label="Logout"
            to="/"
          />
        </button>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, to }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  const baseClasses = `
    flex items-center gap-1 lg:gap-3 p-1 lg:p-3 rounded-lg 
    text-black transition
  `;

  const activeClasses = isActive
    ? "bg-teal-50 hover:bg-teal-100"
    : "hover:bg-teal-100"; // Use a neutral hover for inactive items

  const combinedClasses = `${baseClasses} ${activeClasses}`;

  return (
    <Link
      to={to}
      // Apply the combined classes
      className={combinedClasses}
    >
      <span>{icon}</span>
      <span className="font-medium text-xs lg:text-base">{label}</span>
    </Link>
  );
}

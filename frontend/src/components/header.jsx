import React from "react";
import { UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function ProfileHeader() {
  const [userName, setUserName] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("user"));

    if (!userData) {
      navigate("/");
    } else {
      setUserName(userData.data.name);
    }
  }, []);

  return (
    <header className="sticky top-0 z-10 bg-white shadow-md ">
      <div className="flex justify-between items-center h-24 px-6">
        <div className="flex items-center justify-center h-full ">
          <img src="/logo.png" className="h-12" />
        </div>
        <div className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition">
          <span className="text-gray-700 font-medium text-sm md:text-base">
            {userName}
          </span>
          {/* Profile Icon */}
          <UserCircle size={28} className="text-teal-600" />
        </div>
      </div>
    </header>
  );
}

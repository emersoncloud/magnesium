"use client";

import { logout } from "@/app/actions";

export function LogoutButton() {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-600 hover:text-red-700 text-sm font-medium hover:underline"
    >
      Log Out
    </button>
  );
}

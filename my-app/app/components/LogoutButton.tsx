"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.clear();

    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-800 hover:bg-red-900 text-white rounded-md px-3 py-2"
    >
      Logout
    </button>
  );
}
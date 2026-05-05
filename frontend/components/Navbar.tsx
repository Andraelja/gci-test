"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const auth = useAuth();
  const user = auth.user;
  const logout = auth.logout;
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl normal-case">
          Garuda Tes
        </Link>
      </div>
      <div className="flex-none gap-2">
        <Link href="/dashboard" className="btn btn-ghost">
          Dashboard
        </Link>
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content font-bold flex items-center justify-center">
                {user.username[0].toUpperCase()}
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
            >
              <li className="menu-title">{user.username}</li>
              <li>
                <Link href="/dashboard">Posts</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <Link href="/login" className="btn btn-outline">
              Login
            </Link>
            <Link href="/register" className="btn">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

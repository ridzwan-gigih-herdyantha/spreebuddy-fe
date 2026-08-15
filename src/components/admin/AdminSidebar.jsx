import { NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Avatar from "@/components/ui/Avatar";
import Logo from "@/components/ui/Logo";
import { logoutUser } from "@/api/auth";
import { adminNav } from "@/config/admin";
import { useAuth } from "@/hooks/useAuth";

export default function AdminSidebar({ user }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const signOut = useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      logout();
      navigate("/", { replace: true });
    },
  });

  return (
    <aside className="sb-admin-sidebar">
      <div className="sb-admin-brand">
        <Logo />
        <span className="sb-admin-badge">Admin</span>
      </div>

      <nav className="sb-admin-nav">
        {adminNav.map(({ label, to, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `sb-admin-nav-item ${isActive ? "is-active" : ""}`
            }
          >
            <i className={`bi ${icon}`} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sb-admin-user">
        <Avatar name={user.name} src={user.avatarUrl} title={user.name} />
        <div className="min-w-0">
          <div className="sb-admin-user-name text-truncate">{user.name}</div>
          <div className="sb-admin-user-role">Administrator</div>
        </div>
        <button
          type="button"
          className="sb-admin-signout"
          aria-label="Sign out"
          disabled={signOut.isPending}
          onClick={() => signOut.mutate()}
        >
          <i className="bi bi-box-arrow-right" />
        </button>
      </div>
    </aside>
  );
}

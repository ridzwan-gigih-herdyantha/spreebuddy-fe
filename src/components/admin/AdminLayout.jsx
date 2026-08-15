import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import AdminSidebar from "./AdminSidebar";
import Logo from "@/components/ui/Logo";
import { logoutUser } from "@/api/auth";
import { adminRoutes, isAdmin } from "@/config/admin";
import { adminDeniedContent } from "@/data/admin";
import { useAuth } from "@/hooks/useAuth";

function Denied({ user }) {
  const { title, lead, back, signOut } = adminDeniedContent;
  const navigate = useNavigate();
  const { logout } = useAuth();

  const leave = useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      logout();
      navigate(adminRoutes.login, { replace: true });
    },
  });

  return (
    <div className="sb-admin-auth">
      <div className="sb-admin-auth-card text-center">
        <Logo />
        <h1 className="sb-h2 mt-4 mb-2">{title}</h1>
        <p className="sb-lead mb-1">{lead}</p>
        <p className="sb-meta mb-4">{user.email}</p>

        <button
          type="button"
          className="btn btn-primary sb-btn-block"
          disabled={leave.isPending}
          onClick={() => leave.mutate()}
        >
          {signOut}
        </button>

        <Link to={back.to} className="sb-admin-auth-back mt-3">
          <i className="bi bi-arrow-left" /> {back.label}
        </Link>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="sb-admin-boot">Checking access…</div>;
  if (!user) return <Navigate to={adminRoutes.login} replace />;
  if (!isAdmin(user)) return <Denied user={user} />;

  return (
    <div className="sb-admin">
      <AdminSidebar user={user} />
      <main className="sb-admin-main">
        <Outlet />
      </main>
    </div>
  );
}

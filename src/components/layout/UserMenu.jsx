import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Avatar from "@/components/ui/Avatar";
import { logoutUser } from "@/api/auth";
import { userMenu } from "@/config/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const signOut = useMutation({
    mutationFn: logoutUser,
    // Clear local state either way; a failed call must not keep the user stuck.
    onSettled: () => {
      logout();
      setOpen(false);
      navigate("/", { replace: true });
    },
  });

  useEffect(() => {
    if (!open) return;

    const close = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="sb-user" data-open={open} ref={ref}>
      <button
        type="button"
        className="sb-user-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((state) => !state)}
      >
        <Avatar name={user.name} src={user.avatarUrl} title={user.name} />
        {/* <i className="bi bi-chevron-down" /> */}
      </button>

      {open && (
        <div className="sb-user-menu" role="menu">
          <div className="sb-user-head">
            <Avatar name={user.name} src={user.avatarUrl} title={user.name} />
            <div className="min-w-0">
              <div className="sb-user-name text-truncate">{user.name}</div>
              <div className="sb-user-email text-truncate">{user.email}</div>
            </div>
          </div>

          <div className="sb-user-divider" />

          {userMenu.map(({ label, to, icon }) => (
            <Link
              key={to}
              to={to}
              role="menuitem"
              className="sb-user-item"
              onClick={() => setOpen(false)}
            >
              <i className={`bi ${icon}`} />
              {label}
            </Link>
          ))}

          <div className="sb-user-divider" />

          <button
            type="button"
            role="menuitem"
            className="sb-user-item is-danger"
            disabled={signOut.isPending}
            onClick={() => signOut.mutate()}
          >
            <i className="bi bi-box-arrow-right" />
            {signOut.isPending ? "Signing out…" : "Log out"}
          </button>
        </div>
      )}
    </div>
  );
}

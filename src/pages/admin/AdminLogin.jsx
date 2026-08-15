import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import AuthSplit from "@/components/auth/AuthSplit";
import PasswordToggle from "@/components/auth/PasswordToggle";
import TextField from "@/components/ui/TextField";
import { loginUser } from "@/api/auth";
import { adminRoutes, isAdmin } from "@/config/admin";
import { adminLoginContent } from "@/data/admin";
import { useAuth } from "@/hooks/useAuth";

function Aside({ title, lead, benefits }) {
  return (
    <>
      <span className="sb-admin-badge is-inverse">Admin console</span>
      <h2 className="sb-h2 text-white mt-3 mb-2">{title}</h2>
      <p className="sb-auth-aside-lead mb-5">{lead}</p>

      <ul className="sb-auth-benefits mb-0">
        {benefits.map(({ icon, label }) => (
          <li key={label}>
            <span className="sb-auth-benefit-icon">
              <i className={`bi ${icon}`} />
            </span>
            {label}
          </li>
        ))}
      </ul>
    </>
  );
}

export default function AdminLogin() {
  const {
    badge,
    title,
    lead,
    identifierLabel,
    identifierPlaceholder,
    remember,
    submit,
    note,
    back,
    aside,
  } = adminLoginContent;

  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [visible, setVisible] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const { mutate, isPending, error } = useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      if (res?.data?.token) login(res.data.token);
      navigate(adminRoutes.dashboard, { replace: true });
    },
    onError: (err) => {
      err.fieldErrors?.forEach(({ field, message }) =>
        setError(field, { message }),
      );
    },
  });

  const formError = error && !error.fieldErrors?.length ? error.message : null;

  if (isAdmin(user)) return <Navigate to={adminRoutes.dashboard} replace />;

  return (
    <AuthSplit aside={<Aside {...aside} />} asideClassName="sb-auth-ink">
      <div className="d-flex align-items-center gap-2 mt-4 mb-2">
        <h1 className="sb-h1 mb-0">{title}</h1>
        <span className="sb-admin-badge">{badge}</span>
      </div>
      <p className="sb-lead mb-4">{lead}</p>

      <form
        className="sb-auth-fields"
        onSubmit={handleSubmit((values) => mutate(values))}
        noValidate
      >
        {formError && (
          <p className="sb-form-error" role="alert">
            <i className="bi bi-exclamation-triangle-fill" /> {formError}
          </p>
        )}

        <TextField
          id="identifier"
          label={identifierLabel}
          placeholder={identifierPlaceholder}
          autoComplete="username"
          error={errors.identifier?.message}
          {...register("identifier", {
            required: "Enter your email or username",
          })}
        />

        <TextField
          id="password"
          type={visible ? "text" : "password"}
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          trailing={
            <PasswordToggle
              visible={visible}
              onToggle={() => setVisible((v) => !v)}
            />
          }
          {...register("password", { required: "Enter your password" })}
        />

        <label className="sb-check mb-0">
          <input type="checkbox" {...register("remember")} />
          <span>{remember}</span>
        </label>

        <button
          type="submit"
          className="btn btn-primary sb-btn-block"
          disabled={isPending}
        >
          {isPending ? "Signing in…" : submit}
        </button>
      </form>

      <div className="sb-admin-notice mt-4">
        <i className="bi bi-shield-lock-fill" />
        <p className="mb-0">{note}</p>
      </div>

      <Link
        to={back.to}
        className="sb-small fw-semibold d-inline-flex gap-2 mt-4"
      >
        <i className="bi bi-arrow-left" /> {back.label}
      </Link>
    </AuthSplit>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import AuthSplit from "@/components/auth/AuthSplit";
import PasswordToggle from "@/components/auth/PasswordToggle";
import TextField from "@/components/ui/TextField";
import { loginUser } from "@/api/auth";
import { loginContent } from "@/data/auth";

function Aside({ title, lead }) {
  return (
    <>
      <h2 className="sb-h2 text-white mb-2">{title}</h2>
      <p className="sb-auth-aside-lead mb-0">{lead}</p>
    </>
  );
}

export default function Login() {
  const {
    title,
    lead,
    submit,
    identifierLabel,
    identifierPlaceholder,
    remember,
    forgot,
    note,
    footer,
    aside,
  } = loginContent;
  const navigate = useNavigate();
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
      if (res?.data?.token) localStorage.setItem("token", res.data.token);
      navigate("/", { replace: true });
    },
    onError: (err) => {
      err.fieldErrors?.forEach(({ field, message }) =>
        setError(field, { message }),
      );
    },
  });

  const formError = error && !error.fieldErrors?.length ? error.message : null;

  return (
    <AuthSplit aside={<Aside {...aside} />} asideClassName="sb-auth-photo">
      <h1 className="sb-h1 mt-4 mb-2">{title}</h1>
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

        <div className="d-flex align-items-center justify-content-between">
          <label className="sb-check mb-0">
            <input type="checkbox" {...register("remember")} />
            <span>{remember}</span>
          </label>
          <Link to={forgot.to} className="sb-small fw-semibold">
            {forgot.label}
          </Link>
        </div>

        <button
          type="submit"
          className="btn btn-primary sb-btn-block"
          disabled={isPending}
        >
          {isPending ? "Signing in…" : submit}
        </button>
      </form>

      <p className="sb-meta text-center mt-4 mb-4">
        {footer.text}{" "}
        <Link to={footer.to} className="fw-semibold">
          {footer.linkLabel}
        </Link>
      </p>

      <div className="sb-auth-note">
        <i className="bi bi-lock-fill" />
        <p className="mb-0">{note}</p>
      </div>
    </AuthSplit>
  );
}

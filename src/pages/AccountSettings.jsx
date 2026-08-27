import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AvatarField from "@/components/auth/AvatarField";
import PasswordToggle from "@/components/auth/PasswordToggle";
import Spinner from "@/components/ui/Spinner";
import TextField from "@/components/ui/TextField";
import { logoutUser, updateMe } from "@/api/auth";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { accountSettingsContent } from "@/data/account";

const ADDRESS_PARTS = [
  "street",
  "district",
  "city",
  "state",
  "zip",
  "fullAddress",
];

const toForm = (user) => ({
  name: user?.name ?? "",
  username: user?.username ?? "",
  email: user?.email ?? "",
  phone: user?.phone ?? "",
  password: "",
  address: Object.fromEntries(
    ADDRESS_PARTS.map((part) => [part, user?.address?.[part] ?? ""]),
  ),
});

export default function AccountSettings() {
  const content = accountSettingsContent;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();
  const toast = useToast();

  const [avatar, setAvatar] = useState(null);
  const [visible, setVisible] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ mode: "onTouched", values: toForm(user) });

  const save = useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      setAvatar(null);
      toast.success(content.saved);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err) => {
      err.fieldErrors?.forEach(({ field, message }) => {
        if (field) setError(field, { message });
      });
      if (!err.fieldErrors?.length) toast.error(err.message);
    },
  });

  const signOut = useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      logout();
      navigate("/", { replace: true });
    },
  });

  const onSubmit = (values) => {
    const parts = ADDRESS_PARTS.map((part) => values.address?.[part]?.trim());
    const filled = parts.filter(Boolean);

    if (filled.length > 0 && filled.length < ADDRESS_PARTS.length) {
      setError("address.street", { message: content.errors.address });
      return;
    }

    save.mutate({
      name: values.name.trim(),
      username: values.username.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      ...(values.password ? { password: values.password } : {}),
      address:
        filled.length === ADDRESS_PARTS.length
          ? Object.fromEntries(
              ADDRESS_PARTS.map((part, index) => [part, parts[index]]),
            )
          : null,
      ...(avatar ? { avatar } : {}),
    });
  };

  if (!user) {
    return (
      <section className="sb-section text-center">
        <h1 className="sb-h1 mb-2">Sign in to change your settings</h1>
        <Link to="/login" className="btn btn-primary rounded-pill px-4 mt-3">
          Sign in
        </Link>
      </section>
    );
  }

  const formError =
    save.error && !save.error.fieldErrors?.length ? save.error.message : null;

  return (
    <section className="sb-section">
      <Link to={content.back.to} className="sb-admin-back">
        <i className="bi bi-arrow-left" /> {content.back.label}
      </Link>

      <h1 className="sb-h1 mt-2 mb-1">{content.title}</h1>
      <p className="sb-lead mb-4">{content.lead}</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {formError && (
          <p className="sb-form-error" role="alert">
            <i className="bi bi-exclamation-triangle-fill" /> {formError}
          </p>
        )}

        <div className="row g-3">
          <div className="col-12 col-lg-7">
            <section className="sb-card sb-panel mb-3">
              <div className="sb-panel-head">
                <h2 className="sb-h3 mb-0">{content.sections.profile}</h2>
              </div>

              <div className="sb-panel-body sb-form-grid">
                <AvatarField
                  id="account-avatar"
                  label={content.fields.avatar}
                  help={content.help.avatar}
                  file={avatar}
                  onClear={() => setAvatar(null)}
                  onChange={(event) =>
                    setAvatar(event.target.files?.[0] ?? null)
                  }
                />

                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <TextField
                      id="account-name"
                      label={content.fields.name}
                      error={errors.name?.message}
                      {...register("name", { required: "Name is required" })}
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <TextField
                      id="account-username"
                      label={content.fields.username}
                      error={errors.username?.message}
                      {...register("username", {
                        required: "Username is required",
                      })}
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <TextField
                      id="account-email"
                      type="email"
                      label={content.fields.email}
                      error={errors.email?.message}
                      {...register("email", { required: "Email is required" })}
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <TextField
                      id="account-phone"
                      label={content.fields.phone}
                      help={content.help.phone}
                      error={errors.phone?.message}
                      {...register("phone", {
                        required: "Phone is required",
                        pattern: {
                          value: /^\+?\d{10,15}$/,
                          message: content.help.phone,
                        },
                      })}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="sb-card sb-panel">
              <div className="sb-panel-head">
                <h2 className="sb-h3 mb-0">{content.sections.address}</h2>
              </div>

              <div className="sb-panel-body">
                <p className="sb-meta">{content.help.address}</p>

                <div className="row g-3">
                  {ADDRESS_PARTS.map((part) => (
                    <div
                      className={
                        part === "fullAddress" ? "col-12" : "col-12 col-sm-6"
                      }
                      key={part}
                    >
                      <TextField
                        id={`account-${part}`}
                        label={content.fields[part]}
                        error={errors.address?.[part]?.message}
                        {...register(`address.${part}`)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="col-12 col-lg-5">
            <section className="sb-card sb-panel mb-3">
              <div className="sb-panel-head">
                <h2 className="sb-h3 mb-0">{content.sections.security}</h2>
              </div>

              <div className="sb-panel-body">
                <TextField
                  id="account-password"
                  type={visible ? "text" : "password"}
                  label={content.fields.password}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  help={content.help.password}
                  error={errors.password?.message}
                  trailing={
                    <PasswordToggle
                      visible={visible}
                      onToggle={() => setVisible((v) => !v)}
                    />
                  }
                  {...register("password", {
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
              </div>
            </section>

            <section className="sb-card sb-panel">
              <div className="sb-panel-head">
                <h2 className="sb-h3 mb-0">{content.sections.session}</h2>
              </div>

              <div className="sb-panel-body">
                <p className="sb-meta mb-3">{content.signOutLead}</p>
                <button
                  type="button"
                  className="sb-pill sb-pill-danger"
                  disabled={signOut.isPending}
                  onClick={() => signOut.mutate()}
                >
                  {signOut.isPending ? (
                    <Spinner size={14} />
                  ) : (
                    <i className="bi bi-box-arrow-right" />
                  )}
                  {signOut.isPending ? content.signingOut : content.signOut}
                </button>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="btn btn-primary rounded-pill px-4"
            disabled={save.isPending}
          >
            {save.isPending && <Spinner size={14} className="me-2" />}
            {save.isPending ? content.pending : content.submit}
          </button>
        </div>
      </form>
    </section>
  );
}

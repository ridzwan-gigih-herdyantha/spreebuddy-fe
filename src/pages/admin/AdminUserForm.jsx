import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AvatarField from "@/components/auth/AvatarField";
import PasswordToggle from "@/components/auth/PasswordToggle";
import TextField from "@/components/ui/TextField";
import { getUser, updateUser } from "@/api/admin";
import { adminRoutes } from "@/config/admin";
import { userFormContent } from "@/data/admin";

const ADDRESS_PARTS = [
  "street",
  "district",
  "city",
  "state",
  "zip",
  "fullAddress",
];

const blank = {
  name: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  address: Object.fromEntries(ADDRESS_PARTS.map((part) => [part, ""])),
};

const toForm = (user) => ({
  name: user.name ?? "",
  username: user.username ?? "",
  email: user.email ?? "",
  phone: user.phone ?? "",
  password: "",
  address: Object.fromEntries(
    ADDRESS_PARTS.map((part) => [part, user.address?.[part] ?? ""]),
  ),
});

export default function AdminUserForm() {
  const { id } = useParams();
  const content = userFormContent;

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [avatar, setAvatar] = useState(null);
  const [visible, setVisible] = useState(false);

  const query = useQuery({
    queryKey: ["admin", "user", id],
    queryFn: () => getUser(id),
    retry: false,
  });

  const user = query.data?.data;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    values: user ? toForm(user) : blank,
  });

  const save = useMutation({
    mutationFn: (body) => updateUser({ id, ...body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      navigate(`${adminRoutes.users}/${id}`, { replace: true });
    },
    onError: (err) => {
      err.fieldErrors?.forEach(({ field, message }) => {
        if (field) setError(field, { message });
      });
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
      // Sending an empty password would fail the min-length rule.
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

  const formError =
    save.error && !save.error.fieldErrors?.length ? save.error.message : null;

  if (query.isError) {
    return (
      <div className="sb-admin-soon">
        <h1 className="sb-h1 mb-2">User not found</h1>
        <p className="sb-lead mb-4">{query.error.message}</p>
        <Link to={content.back.to} className="sb-pill sb-pill-outline">
          <i className="bi bi-arrow-left" /> {content.back.label}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <header className="sb-admin-head">
        <div>
          <Link to={content.back.to} className="sb-admin-back">
            <i className="bi bi-arrow-left" /> {content.back.label}
          </Link>
          <h1 className="sb-h1 mt-2 mb-1">{content.title}</h1>
          <p className="sb-lead mb-0">{content.lead}</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Link
            to={`${adminRoutes.users}/${id}`}
            className="sb-pill sb-pill-outline"
          >
            {content.cancel}
          </Link>
          <button
            type="submit"
            className="btn btn-primary rounded-pill px-4 text-nowrap"
            disabled={save.isPending || query.isPending}
          >
            {save.isPending ? content.pending : content.submit}
          </button>
        </div>
      </header>

      {formError && (
        <p className="sb-form-error" role="alert">
          <i className="bi bi-exclamation-triangle-fill" /> {formError}
        </p>
      )}

      <div className="row g-3">
        <div className="col-12 col-xl-8">
          <div className="d-flex flex-column gap-3">
            <section className="sb-card sb-panel">
              <div className="sb-panel-head">
                <h2 className="sb-h3 mb-0">{content.sections.profile}</h2>
              </div>

              <div className="sb-panel-body sb-form-grid">
                <AvatarField
                  id="avatar"
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
                      id="name"
                      label={content.fields.name}
                      error={errors.name?.message}
                      {...register("name", { required: "Name is required" })}
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <TextField
                      id="username"
                      label={content.fields.username}
                      error={errors.username?.message}
                      {...register("username", {
                        required: "Username is required",
                      })}
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <TextField
                      id="email"
                      type="email"
                      label={content.fields.email}
                      error={errors.email?.message}
                      {...register("email", { required: "Email is required" })}
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <TextField
                      id="phone"
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
                <span className="sb-meta">{content.help.address}</span>
              </div>

              <div className="sb-panel-body">
                <div className="row g-3">
                  {ADDRESS_PARTS.map((part) => (
                    <div
                      className={
                        part === "fullAddress" ? "col-12" : "col-12 col-sm-6"
                      }
                      key={part}
                    >
                      <TextField
                        id={part}
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
        </div>

        <div className="col-12 col-xl-4">
          <section className="sb-card sb-panel">
            <div className="sb-panel-head">
              <h2 className="sb-h3 mb-0">{content.sections.security}</h2>
            </div>

            <div className="sb-panel-body">
              <TextField
                id="password"
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
        </div>
      </div>
    </form>
  );
}

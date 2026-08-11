import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import AuthSplit from "@/components/auth/AuthSplit";
import AvatarField from "@/components/auth/AvatarField";
import PasswordStrength from "@/components/auth/PasswordStrength";
import PasswordToggle from "@/components/auth/PasswordToggle";
import TextField from "@/components/ui/TextField";
import { registerUser } from "@/api/auth";
import { registerContent } from "@/data/auth";

const PHONE_PATTERN = /^\+?\d{10,15}$/;
const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

function Aside({ title, benefits, card }) {
  return (
    <>
      <h2 className="sb-h2 text-white text-center mb-4">{title}</h2>

      <ul className="sb-auth-benefits">
        {benefits.map(({ icon, label }) => (
          <li key={label}>
            <span className="sb-auth-benefit-icon">
              <i className={`bi ${icon}`} />
            </span>
            {label}
          </li>
        ))}
      </ul>

      <div className="sb-auth-card">
        <span className="sb-auth-card-thumb">
          <i className={`bi ${card.icon}`} />
        </span>
        <div className="min-w-0">
          <div className="sb-auth-card-eyebrow">{card.eyebrow}</div>
          <div className="fw-semibold text-truncate">{card.name}</div>
          <div className="sb-auth-card-price">{card.price}</div>
        </div>
        <i className="bi bi-heart-fill ms-auto" />
      </div>
    </>
  );
}

export default function Register() {
  const { title, lead, submit, footer, aside } = registerContent;
  const navigate = useNavigate();
  const [visible, setVisible] = useState({ password: false, confirm: false });

  const {
    register,
    handleSubmit,
    control,
    setError,
    resetField,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const password = useWatch({ control, name: "password", defaultValue: "" });
  const avatarList = useWatch({ control, name: "avatar" });
  const avatar = avatarList?.[0] ?? null;

  const { mutate, isPending, error } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => navigate("/login", { replace: true }),
    onError: (err) => {
      err.fieldErrors?.forEach(({ field, message }) =>
        setError(field, { message }),
      );
    },
  });

  const formError = error && !error.fieldErrors?.length ? error.message : null;

  return (
    <AuthSplit aside={<Aside {...aside} />}>
      <h1 className="sb-h1 mt-4 mb-2">{title}</h1>
      <p className="sb-lead mb-4">{lead}</p>

      <form
        className="sb-auth-fields"
        onSubmit={handleSubmit((values) => mutate({ ...values, avatar }))}
        noValidate
      >
        {formError && (
          <p className="sb-form-error" role="alert">
            <i className="bi bi-exclamation-triangle-fill" /> {formError}
          </p>
        )}

        <TextField
          id="name"
          label="Full name"
          placeholder="Your full name"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name", { required: "Enter your full name" })}
        />

        <TextField
          id="username"
          label="Username"
          placeholder="yourusername"
          autoComplete="username"
          error={errors.username?.message}
          {...register("username", {
            required: "Choose a username",
            pattern: {
              value: /^[a-zA-Z0-9._-]{3,}$/,
              message: "Use 3+ letters, numbers, dot, underscore or dash",
            },
          })}
        />

        <TextField
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email", {
            required: "Enter your email",
            pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" },
          })}
        />

        <AvatarField
          id="avatar"
          label="Profile photo"
          help="Optional. JPEG, PNG, WebP or GIF, up to 2 MB."
          file={avatar}
          error={errors.avatar?.message}
          onClear={() => resetField("avatar")}
          {...register("avatar", {
            validate: {
              type: (list) =>
                !list?.[0] ||
                AVATAR_TYPES.includes(list[0].type) ||
                "Use a JPEG, PNG, WebP or GIF image",
              size: (list) =>
                !list?.[0] ||
                list[0].size <= AVATAR_MAX_BYTES ||
                "Keep the image under 2 MB",
            },
          })}
        />

        <TextField
          id="phone"
          type="tel"
          label="Phone number"
          placeholder="+6281234567890"
          autoComplete="tel"
          error={errors.phone?.message}
          help="10 to 15 digits, may start with +"
          {...register("phone", {
            required: "Enter your phone number",
            pattern: {
              value: PHONE_PATTERN,
              message: "Enter a valid phone number",
            },
          })}
        />

        <div>
          <TextField
            id="password"
            type={visible.password ? "text" : "password"}
            label="Password"
            placeholder="At least 6 characters"
            autoComplete="new-password"
            error={errors.password?.message}
            trailing={
              <PasswordToggle
                visible={visible.password}
                onToggle={() =>
                  setVisible((s) => ({ ...s, password: !s.password }))
                }
              />
            }
            {...register("password", {
              required: "Choose a password",
              minLength: { value: 6, message: "Use at least 6 characters" },
            })}
          />
          <PasswordStrength value={password} />
        </div>

        <TextField
          id="confirm"
          type={visible.confirm ? "text" : "password"}
          label="Confirm password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={errors.confirm?.message}
          trailing={
            <PasswordToggle
              visible={visible.confirm}
              onToggle={() =>
                setVisible((s) => ({ ...s, confirm: !s.confirm }))
              }
            />
          }
          {...register("confirm", {
            required: "Repeat your password",
            validate: (value, values) =>
              value === values.password || "Passwords do not match",
          })}
        />

        <label className="sb-check">
          <input type="checkbox" {...register("terms", { required: true })} />
          <span>
            I agree to the <Link to="/terms">Terms</Link> and{" "}
            <Link to="/privacy">Privacy Policy</Link>
          </span>
        </label>

        <button
          type="submit"
          className="btn btn-primary sb-btn-block"
          disabled={isPending}
        >
          {isPending ? "Creating account…" : submit}
        </button>
      </form>

      <p className="sb-meta text-center mt-4 mb-0">
        {footer.text}{" "}
        <Link to={footer.to} className="fw-semibold">
          {footer.linkLabel}
        </Link>
      </p>
    </AuthSplit>
  );
}

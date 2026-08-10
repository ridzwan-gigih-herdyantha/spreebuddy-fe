import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import AuthSplit from "@/components/auth/AuthSplit";
import PasswordStrength from "@/components/auth/PasswordStrength";
import PasswordToggle from "@/components/auth/PasswordToggle";
import TextField from "@/components/ui/TextField";
import { registerContent } from "@/data/auth";

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
  const [visible, setVisible] = useState({ password: false, confirm: false });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const password = useWatch({ control, name: "password", defaultValue: "" });

  return (
    <AuthSplit aside={<Aside {...aside} />}>
      <h1 className="sb-h1 mt-4 mb-2">{title}</h1>
      <p className="sb-lead mb-4">{lead}</p>

      <form
        className="sb-auth-fields"
        onSubmit={handleSubmit((values) => console.log(values))}
        noValidate
      >
        <TextField
          id="name"
          label="Full name"
          placeholder="Your Full Name"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name", { required: "Enter your full name" })}
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

        <div>
          <TextField
            id="password"
            type={visible.password ? "text" : "password"}
            label="Password"
            placeholder="At least 8 characters"
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
              minLength: { value: 8, message: "Use at least 8 characters" },
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

        <button type="submit" className="btn btn-primary sb-btn-block">
          {submit}
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

import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthSplit from "@/components/auth/AuthSplit";
import PasswordToggle from "@/components/auth/PasswordToggle";
import TextField from "@/components/ui/TextField";
import Logo from "@/components/ui/Logo";
import { loginContent } from "@/data/auth";

function Aside({ title, lead, chat }) {
  const { question, answer, product } = chat;

  return (
    <>
      <div className="sb-auth-chat sb-shadow-lg mb-5">
        <div className="sb-bubble sb-bubble-user mb-3">{question}</div>

        <div className="d-flex align-items-start gap-2">
          <Logo withText={false} />
          <div className="sb-bubble sb-bubble-ai">
            {answer}
            <div className="sb-auth-chat-product">
              <span className="sb-auth-chat-thumb">
                <i className={`bi ${product.icon}`} />
              </span>
              <div className="min-w-0">
                <div className="sb-small text-truncate">{product.name}</div>
                <div>
                  <span className="fw-bold text-primary">{product.price}</span>
                  <span className="sb-price-old ms-2">{product.oldPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="sb-h2 text-white mb-2">{title}</h2>
      <p className="sb-auth-aside-lead mb-0">{lead}</p>
    </>
  );
}

export default function Login() {
  const { title, lead, submit, remember, forgot, note, footer, aside } =
    loginContent;
  const [visible, setVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

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
          id="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email", {
            required: "Enter your email",
            pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" },
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

        <button type="submit" className="btn btn-primary sb-btn-block">
          {submit}
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

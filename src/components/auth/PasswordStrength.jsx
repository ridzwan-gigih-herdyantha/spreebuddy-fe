import { passwordStrength } from "@/data/auth";
import { scorePassword, strengthClass } from "@/utils/password";

export default function PasswordStrength({ value }) {
  const score = scorePassword(value);
  if (!value || !score) return null;

  return (
    <div className="sb-strength-row">
      <div className="sb-strength" aria-hidden="true">
        {[1, 2, 3].map((step) => (
          <span
            key={step}
            className={step <= score ? `is-on ${strengthClass[score]}` : ""}
          />
        ))}
      </div>
      <span className="sb-field-help mb-0">
        {passwordStrength.prefix} {passwordStrength.labels[score - 1]}
      </span>
    </div>
  );
}

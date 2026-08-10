import { passwordStrength } from "@/data/auth";

export function scorePassword(value = "") {
  if (value.length < 8) return 0;
  let score = 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/\d/.test(value) || /[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
}

const scoreColor = {
  1: "is-weak",
  2: "is-medium",
  3: "is-strong",
};

export default function PasswordStrength({ value }) {
  const score = scorePassword(value);
  if (!value) return null;

  return (
    <div className="sb-strength-row">
      <div className="sb-strength" aria-hidden="true">
        {[1, 2, 3].map((step) => (
          <span
            key={step}
            className={step <= score ? `is-on ${scoreColor[score]}` : ""}
          />
        ))}
      </div>
      <span className="sb-field-help mb-0">
        {passwordStrength.prefix} {passwordStrength.labels[score - 1]}
      </span>
    </div>
  );
}
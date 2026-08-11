export const PASSWORD_MIN = 6;

export const strengthClass = {
  1: "is-weak",
  2: "is-medium",
  3: "is-strong",
};

export function scorePassword(value = "") {
  if (value.length < PASSWORD_MIN) return 0;
  let score = 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/\d/.test(value) || /[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
}

import TextField from "./TextField";

export default {
  title: "UI/TextField",
  component: TextField,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    id: "tf-default",
    label: "Full name",
    placeholder: "Ada Lovelace",
  },
};

export const WithHelp = {
  args: {
    id: "tf-help",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    help: "We'll never share your email.",
  },
};

export const WithError = {
  args: {
    id: "tf-error",
    label: "Password",
    type: "password",
    error: "Password must be at least 8 characters.",
  },
};

export const WithTrailing = {
  args: {
    id: "tf-trailing",
    label: "Search",
    placeholder: "Find products…",
    trailing: (
      <button type="button" className="sb-input-trailing-btn" aria-label="Clear">
        <i className="bi bi-x" />
      </button>
    ),
  },
};

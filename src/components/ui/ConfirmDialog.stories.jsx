import ConfirmDialog from "./ConfirmDialog";

export default {
  title: "UI/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean" },
    pending: { control: "boolean" },
  },
};

export const Default = {
  args: {
    open: true,
    title: "Delete this item?",
    body: "This action cannot be undone.",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
  },
};

export const Pending = {
  args: {
    open: true,
    title: "Delete this item?",
    body: "This action cannot be undone.",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
    pending: true,
  },
};

export const WithError = {
  args: {
    open: true,
    title: "Delete this item?",
    body: "This action cannot be undone.",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
    error: "Could not delete: server unavailable.",
  },
};

export const Closed = {
  args: {
    open: false,
    title: "Hidden dialog",
    body: "Not rendered when open is false.",
  },
};

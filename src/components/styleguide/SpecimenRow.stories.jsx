import SpecimenRow from "./SpecimenRow";

export default {
  title: "Styleguide/SpecimenRow",
  component: SpecimenRow,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    label: "Primary button",
    children: (
      <button type="button" className="btn btn-primary rounded-pill px-4">
        Continue
      </button>
    ),
  },
};

export const WithText = {
  args: {
    label: "Body copy",
    children: (
      <p className="sb-lead mb-0">
        The quick brown fox jumps over the lazy dog.
      </p>
    ),
  },
};

export const WithSwatchGroup = {
  args: {
    label: "Pill sizes",
    children: (
      <div className="d-flex gap-2 flex-wrap">
        <span className="sb-pill">Small</span>
        <span className="sb-pill sb-pill-outline">Medium</span>
        <span className="sb-pill sb-pill-gradient">Large</span>
      </div>
    ),
  },
};

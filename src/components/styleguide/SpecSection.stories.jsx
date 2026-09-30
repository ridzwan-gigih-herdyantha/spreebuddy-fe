import SpecSection from "./SpecSection";

export default {
  title: "Styleguide/SpecSection",
  component: SpecSection,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    id: "colors",
    eyebrow: "Foundation",
    title: "Colors",
    hint: "The palette powering every surface, badge, and border.",
    children: (
      <p className="sb-meta">Section body content goes here.</p>
    ),
  },
};

export const MinimalHeader = {
  args: {
    id: "typography",
    title: "Typography",
    children: (
      <p className="sb-meta">No eyebrow, no hint — just a title.</p>
    ),
  },
};

export const WithSwatches = {
  args: {
    id: "spacing",
    eyebrow: "Layout",
    title: "Spacing scale",
    hint: "Consistent rhythm for stacks, grids, and gutters.",
    children: (
      <div className="d-flex gap-3">
        {[4, 8, 12, 16, 24, 32].map((n) => (
          <div key={n} className="text-center">
            <div
              style={{
                width: n,
                height: n,
                background: "var(--sb-primary, #6366f1)",
                borderRadius: 4,
              }}
            />
            <div className="sb-meta mt-1">{n}px</div>
          </div>
        ))}
      </div>
    ),
  },
};

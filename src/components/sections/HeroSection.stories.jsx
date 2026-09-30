import HeroSection from "./HeroSection";
import {
  successHandlers,
  emptyHandlers,
  errorHandlers,
  loadingHandlers,
} from "../../../.storybook/mocks/handlers";

export default {
  title: "Sections/HeroSection",
  component: HeroSection,
  tags: ["autodocs"],
};

export const Default = {
  parameters: { msw: { handlers: successHandlers } },
};

export const Loading = {
  parameters: { msw: { handlers: loadingHandlers } },
};

export const Empty = {
  parameters: { msw: { handlers: emptyHandlers } },
};

export const ApiDown = {
  parameters: { msw: { handlers: errorHandlers } },
};

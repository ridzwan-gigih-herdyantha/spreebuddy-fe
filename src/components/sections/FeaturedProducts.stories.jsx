import FeaturedProducts from "./FeaturedProducts";
import {
  successHandlers,
  emptyHandlers,
  errorHandlers,
  loadingHandlers,
} from "../../../.storybook/mocks/handlers";

export default {
  title: "Sections/FeaturedProducts",
  component: FeaturedProducts,
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

export const ApiError = {
  parameters: { msw: { handlers: errorHandlers } },
};

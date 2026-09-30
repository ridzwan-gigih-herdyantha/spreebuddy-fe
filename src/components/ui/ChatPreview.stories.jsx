import ChatPreview from "./ChatPreview";
import {
  successHandlers,
  emptyHandlers,
  errorHandlers,
  loadingHandlers,
} from "../../../.storybook/mocks/handlers";

export default {
  title: "UI/ChatPreview",
  component: ChatPreview,
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

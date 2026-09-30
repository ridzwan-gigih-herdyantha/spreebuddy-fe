import GlobalSearch from "./GlobalSearch";
import {
  successHandlers,
  emptyHandlers,
  errorHandlers,
  loadingHandlers,
} from "../../../.storybook/mocks/handlers";

export default {
  title: "UI/GlobalSearch",
  component: GlobalSearch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Type at least 2 characters to trigger search. Use Cmd+K / Ctrl+K to focus.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export const Default = {
  parameters: { msw: { handlers: successHandlers } },
};

export const Loading = {
  parameters: { msw: { handlers: loadingHandlers } },
};

export const NoResults = {
  parameters: { msw: { handlers: emptyHandlers } },
};

export const ApiError = {
  parameters: { msw: { handlers: errorHandlers } },
};

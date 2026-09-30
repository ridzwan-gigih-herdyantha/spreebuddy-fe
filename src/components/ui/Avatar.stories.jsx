import Avatar from "./Avatar";

export default {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
};

export const Initial = { args: { name: "Ada Lovelace" } };

export const WithImage = {
  args: {
    name: "Grace Hopper",
    src: "https://i.pravatar.cc/80?img=47",
    title: "Grace Hopper",
  },
};

export const Fallback = { args: { name: "?" } };

export const LongName = { args: { name: "Zaphod Beeblebrox IV" } };

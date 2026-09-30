import Skeleton, {
  SkeletonText,
  SkeletonRows,
  SkeletonCards,
} from "./Skeleton";

export default {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
};

export const Bar = {
  args: { width: 240, height: 12, radius: 6 },
};

export const Square = {
  args: { width: 64, height: 64, radius: 12 },
};

export const TextLines = {
  render: () => <SkeletonText lines={4} />,
};

export const Rows = {
  render: () => <SkeletonRows rows={4} columns={3} />,
};

export const Cards = {
  render: () => (
    <div className="row row-cols-2 g-3">
      <SkeletonCards count={4} height={120} />
    </div>
  ),
};

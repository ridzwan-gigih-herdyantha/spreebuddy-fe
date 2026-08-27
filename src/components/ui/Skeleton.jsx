export default function Skeleton({
  width,
  height,
  radius,
  className = "",
  style,
}) {
  return (
    <span
      className={`sb-skeleton ${className}`}
      aria-hidden="true"
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}

export function SkeletonText({ lines = 3, width = "100%" }) {
  return (
    <span className="sb-skeleton-stack">
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          height={12}
          width={index === lines - 1 ? "60%" : width}
        />
      ))}
    </span>
  );
}

export function SkeletonRows({ rows = 5, columns = 4 }) {
  return (
    <div className="sb-skeleton-rows">
      {Array.from({ length: rows }, (_, row) => (
        <div className="sb-skeleton-row" key={row}>
          {Array.from({ length: columns }, (_, column) => (
            <Skeleton
              key={column}
              height={14}
              width={column === 0 ? "40%" : "70%"}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 4, height = 120 }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div className="col" key={index}>
          <Skeleton className="sb-skeleton-card" height={height} />
        </div>
      ))}
    </>
  );
}

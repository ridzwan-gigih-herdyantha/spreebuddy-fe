import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import { listPosts } from "@/api/blog";
import { formatRelative } from "@/utils/format";
import { blogContent } from "@/data/blog";

const PAGE_SIZE = 9;

// A missing endpoint or an unreachable server both mean "nothing published",
// not "something broke".
const isUnpublished = (error) =>
  error?.status === 404 || error?.status === 0 || error?.status === 501;

function PostCard({ post, content }) {
  return (
    <article className="sb-card sb-card-hover h-100 d-flex flex-column">
      <Link to={`/blog/${post.slug}`} className="sb-post-cover">
        {post.coverUrl ? (
          <img src={post.coverUrl} alt="" />
        ) : (
          <i className="bi bi-journal-text" />
        )}
      </Link>

      <div className="p-4 d-flex flex-column flex-grow-1">
        {post.tags?.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 2).map((tag) => (
              <span className="sb-pill" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <h2 className="sb-h3 mb-2">
          <Link to={`/blog/${post.slug}`} className="sb-prod-link">
            {post.title}
          </Link>
        </h2>

        {post.excerpt && <p className="sb-lead">{post.excerpt}</p>}

        <p className="sb-caption mb-0 mt-auto pt-3">
          {post.author && `${content.by} ${post.author} · `}
          {formatRelative(post.createdAt)}
        </p>
      </div>
    </article>
  );
}

export default function Blog() {
  const content = blogContent;
  const [limit, setLimit] = useState(PAGE_SIZE);

  const posts = useQuery({
    queryKey: ["posts", limit],
    queryFn: () => listPosts({ page: 1, limit }),
    placeholderData: (previous) => previous,
    retry: false,
  });

  const items = posts.data?.data ?? [];
  const hasMore = posts.data?.meta?.hasNextPage ?? false;
  const broke = posts.isError && !isUnpublished(posts.error);
  const nothing = !posts.isPending && !broke && items.length === 0;

  return (
    <>
      <section className="sb-gradient-hero sb-section">
        <div className="sb-measure">
          <Badge className="mb-4">
            <i className="bi bi-journal-text" /> {content.badge}
          </Badge>

          <h1 className="sb-display mb-3">{content.title}</h1>
          <p className="sb-lead mb-0">{content.lead}</p>
        </div>
      </section>

      <section className="sb-section">
        {posts.isPending && (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div className="col" key={index}>
                <Skeleton className="sb-skeleton-card" height={320} />
              </div>
            ))}
          </div>
        )}

        {broke && (
          <div className="sb-card p-5 text-center">
            <h2 className="sb-h2 mb-2">{content.failed.title}</h2>
            <p className="sb-lead mb-4">{content.failed.lead}</p>
            <button
              type="button"
              className="sb-pill sb-pill-outline"
              onClick={() => posts.refetch()}
            >
              <i className="bi bi-arrow-clockwise" /> {content.failed.retry}
            </button>
          </div>
        )}

        {nothing && (
          <div className="sb-card p-5 text-center">
            <h2 className="sb-h2 mb-2">{content.empty.title}</h2>
            <p className="sb-lead sb-measure mx-auto mb-4">
              {content.empty.lead}
            </p>
            <Link
              to={content.empty.action.to}
              className="sb-pill sb-pill-outline"
            >
              {content.empty.action.label}
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {items.map((post) => (
                <div className="col" key={post.id ?? post.slug}>
                  <PostCard post={post} content={content} />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-5">
                <button
                  type="button"
                  className="btn sb-btn-outline rounded-pill px-4"
                  disabled={posts.isFetching}
                  onClick={() => setLimit((value) => value + PAGE_SIZE)}
                >
                  {posts.isFetching ? content.loading : content.loadMore}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

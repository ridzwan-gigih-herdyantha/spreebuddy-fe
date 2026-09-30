import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Skeleton, { SkeletonText } from "@/components/ui/Skeleton";
import { getPost } from "@/api/blog";
import { formatRelative, parseApiDate } from "@/utils/format";
import { usePageSeo } from "@/hooks/usePageSeo";
import { absoluteUrl, summarize } from "@/utils/seo";
import { postContent } from "@/data/blog";

// parseApiDate builds local midnight; toISOString would shift it back a day
// anywhere east of UTC, so the date is assembled from local parts instead.
const isoDate = (date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

export default function BlogPost() {
  const { slug } = useParams();
  const content = postContent;

  const query = useQuery({
    queryKey: ["post", slug],
    queryFn: () => getPost(slug),
    retry: false,
  });

  const post = query.data?.data;

  const published = parseApiDate(post?.createdAt);
  usePageSeo(
    query.isError
      ? { title: "Post not found", noindex: true }
      : post
        ? {
            title: post.title,
            description: summarize(post.excerpt ?? post.content),
            image: post.coverUrl,
            imageAlt: post.title,
            type: "article",
            jsonLd: {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              description: summarize(post.excerpt ?? post.content),
              url: absoluteUrl(`/blog/${slug}`),
              ...(post.coverUrl ? { image: absoluteUrl(post.coverUrl) } : {}),
              ...(published
                ? { datePublished: isoDate(published) }
                : {}),
              ...(post.author
                ? { author: { "@type": "Person", name: post.author } }
                : {}),
              publisher: { "@type": "Organization", name: "SpreeBuddy" },
            },
          }
        : null,
  );

  if (query.isError) {
    return (
      <section className="sb-section text-center">
        <h1 className="sb-h1 mb-2">{content.notFound.title}</h1>
        <p className="sb-lead mb-4">{content.notFound.lead}</p>
        <Link
          to={content.notFound.action.to}
          className="btn btn-primary rounded-pill px-4"
        >
          {content.notFound.action.label}
        </Link>
      </section>
    );
  }

  if (query.isPending) {
    return (
      <section className="sb-section">
        <div className="sb-measure">
          <Skeleton width={120} height={12} />
          <Skeleton height={34} className="mt-4" />
          <Skeleton width="70%" height={34} className="mt-2" />
          <Skeleton width={200} height={12} className="mt-4" />
          <div className="mt-5">
            <SkeletonText lines={8} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <article className="sb-section">
      <div className="sb-measure">
        <Link to={content.back.to} className="sb-admin-back">
          <i className="bi bi-arrow-left" /> {content.back.label}
        </Link>

        {post.tags?.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span className="sb-pill" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="sb-h1 mt-3 mb-3">{post.title}</h1>

        <p className="sb-meta mb-0">
          {post.author && `${content.by} ${post.author} · `}
          {post.createdAt} · {formatRelative(post.createdAt)}
        </p>
      </div>

      {post.coverUrl && (
        <img src={post.coverUrl} alt="" className="sb-post-hero mt-5" />
      )}

      <div className="sb-measure sb-markdown sb-post-body mt-5">
        <Markdown remarkPlugins={[remarkGfm]}>
          {post.content ?? post.excerpt ?? ""}
        </Markdown>
      </div>
    </article>
  );
}

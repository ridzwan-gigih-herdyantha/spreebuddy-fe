import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Avatar from "@/components/ui/Avatar";
import Skeleton, { SkeletonText } from "@/components/ui/Skeleton";
import { listOrders } from "@/api/orders";
import { listWishlist } from "@/api/wishlist";
import { listSessions } from "@/api/chat";
import { formatRelative } from "@/utils/format";
import { useAuth } from "@/hooks/useAuth";
import { accountContent } from "@/data/account";

function Row({ label, children }) {
  return (
    <div className="sb-spec-row">
      <span className="sb-spec-label">{label}</span>
      <span className="sb-spec-value">{children}</span>
    </div>
  );
}

export default function Account() {
  const content = accountContent;
  const { user, isLoading } = useAuth();

  const counts = useQuery({
    queryKey: ["account", "counts"],
    queryFn: async () => {
      const [orders, wishlist, sessions] = await Promise.all([
        listOrders({ page: 1, limit: 1 }),
        listWishlist(),
        listSessions(),
      ]);
      return {
        orders: orders?.meta?.total ?? 0,
        wishlist: wishlist?.meta?.total ?? wishlist?.data?.length ?? 0,
        sessions: sessions?.meta?.total ?? sessions?.data?.length ?? 0,
      };
    },
    enabled: Boolean(user),
    retry: false,
  });

  if (isLoading) {
    return (
      <section className="sb-section">
        <Skeleton width={220} height={28} />
        <div className="sb-card p-4 mt-4">
          <SkeletonText lines={6} />
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="sb-section text-center">
        <h1 className="sb-h1 mb-2">{content.signedOut.title}</h1>
        <p className="sb-lead sb-measure mx-auto mb-4">
          {content.signedOut.lead}
        </p>
        <Link to="/login" className="btn btn-primary rounded-pill px-4">
          Sign in
        </Link>
      </section>
    );
  }

  const address = user.address;
  const stat = (key) => (counts.isPending ? "—" : (counts.data?.[key] ?? 0));

  return (
    <section className="sb-section">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div className="d-flex align-items-center gap-3 min-w-0">
          <Avatar
            name={user.name}
            src={user.avatarUrl}
            className="sb-avatar-lg"
          />
          <div className="min-w-0">
            <h1 className="sb-h1 mb-1 text-truncate">{user.name}</h1>
            <p className="sb-lead mb-0">{content.lead}</p>
          </div>
        </div>

        <Link
          to={content.edit.to}
          className="btn btn-primary rounded-pill px-4 text-nowrap"
        >
          <i className="bi bi-pencil" /> {content.edit.label}
        </Link>
      </div>

      <div className="row row-cols-1 row-cols-sm-3 g-3 mb-4">
        {["orders", "wishlist", "sessions"].map((key) => (
          <div className="col" key={key}>
            <div className="sb-card sb-order-stat">
              <span className="sb-eyebrow text-uppercase">
                {content.stats[key]}
              </span>
              <span className="sb-order-stat-value">{stat(key)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <section className="sb-card sb-panel h-100">
            <div className="sb-panel-head">
              <h2 className="sb-h3 mb-0">{content.profileTitle}</h2>
            </div>
            <div className="sb-panel-body sb-spec-list">
              <Row label={content.fields.username}>@{user.username}</Row>
              <Row label={content.fields.email}>{user.email}</Row>
              <Row label={content.fields.phone}>{user.phone}</Row>
              <Row label={content.fields.joined}>
                {user.createdAt}
                <span className="sb-caption d-block">
                  {formatRelative(user.createdAt)}
                </span>
              </Row>
            </div>
          </section>
        </div>

        <div className="col-12 col-lg-6">
          <section className="sb-card sb-panel h-100">
            <div className="sb-panel-head">
              <h2 className="sb-h3 mb-0">{content.addressTitle}</h2>
            </div>
            <div className="sb-panel-body">
              {address ? (
                <div className="sb-spec-list">
                  <Row label={content.fields.fullAddress}>
                    {address.fullAddress}
                  </Row>
                  <Row label={content.fields.city}>{address.city}</Row>
                  <Row label={content.fields.state}>{address.state}</Row>
                  <Row label={content.fields.zip}>{address.zip}</Row>
                </div>
              ) : (
                <>
                  <p className="sb-lead mb-3">{content.noAddress}</p>
                  <Link
                    to={content.edit.to}
                    className="sb-pill sb-pill-outline"
                  >
                    {content.addAddress}
                  </Link>
                </>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="row row-cols-2 row-cols-lg-4 g-3">
        {content.links.map(({ label, to, icon }) => (
          <div className="col" key={to}>
            <Link to={to} className="sb-card sb-account-link">
              <span className="sb-about-icon">
                <i className={`bi ${icon}`} />
              </span>
              <span className="fw-semibold">{label}</span>
              <i className="bi bi-arrow-right ms-auto" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

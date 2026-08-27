import { Link, useParams } from "react-router-dom";
import Skeleton, { SkeletonText } from "@/components/ui/Skeleton";
import { useQuery } from "@tanstack/react-query";
import Avatar from "@/components/ui/Avatar";
import { getUser } from "@/api/admin";
import { formatRelative } from "@/utils/format";
import { adminRoutes } from "@/config/admin";
import { userDetailContent } from "@/data/admin";

function Row({ label, children }) {
  return (
    <div className="sb-spec-row">
      <span className="sb-spec-label">{label}</span>
      <span className="sb-spec-value">{children}</span>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <>
      <header className="sb-admin-head">
        <div className="w-100">
          <Skeleton width={140} height={12} />
          <Skeleton width="35%" height={26} className="mt-3" />
          <Skeleton width={180} height={12} className="mt-3" />
        </div>
      </header>

      <div className="row g-3">
        <div className="col-12 col-xl-8">
          <div className="sb-card sb-panel p-4">
            <SkeletonText lines={6} />
          </div>
        </div>
        <div className="col-12 col-xl-4">
          <div className="sb-card sb-panel p-4">
            <SkeletonText lines={8} />
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminUserDetail() {
  const { id } = useParams();
  const content = userDetailContent;

  const query = useQuery({
    queryKey: ["admin", "user", id],
    queryFn: () => getUser(id),
    retry: false,
  });

  const user = query.data?.data;

  if (query.isError) {
    return (
      <div className="sb-admin-soon">
        <h1 className="sb-h1 mb-2">User not found</h1>
        <p className="sb-lead mb-4">{query.error.message}</p>
        <Link to={content.back.to} className="sb-pill sb-pill-outline">
          <i className="bi bi-arrow-left" /> {content.back.label}
        </Link>
      </div>
    );
  }

  if (!user) return <DetailSkeleton />;

  const address = user.address;

  return (
    <>
      <header className="sb-admin-head">
        <div className="min-w-0">
          <Link to={content.back.to} className="sb-admin-back">
            <i className="bi bi-arrow-left" /> {content.back.label}
          </Link>

          <div className="d-flex align-items-center gap-3 mt-3">
            <Avatar
              name={user.name}
              src={user.avatarUrl}
              className="sb-avatar-lg"
            />
            <div className="min-w-0">
              <h1 className="sb-h1 mb-1 text-truncate">{user.name}</h1>
              <div className="d-flex flex-wrap align-items-center gap-2">
                <span className="sb-pill">{user.role}</span>
                <span className="sb-meta">@{user.username}</span>
              </div>
            </div>
          </div>
        </div>

        <Link
          to={`${adminRoutes.users}/${user.id}/edit`}
          className="btn btn-primary rounded-pill px-4 text-nowrap"
        >
          <i className="bi bi-pencil" /> {content.edit}
        </Link>
      </header>

      <div className="row g-3">
        <div className="col-12 col-xl-8">
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
                  <Row label={content.fields.street}>{address.street}</Row>
                  <Row label={content.fields.district}>{address.district}</Row>
                  <Row label={content.fields.city}>{address.city}</Row>
                  <Row label={content.fields.state}>{address.state}</Row>
                  <Row label={content.fields.zip}>{address.zip}</Row>
                </div>
              ) : (
                <p className="sb-lead mb-0">{content.noAddress}</p>
              )}
            </div>
          </section>
        </div>

        <div className="col-12 col-xl-4">
          <div className="d-flex flex-column gap-3">
            <section className="sb-card sb-panel">
              <div className="sb-panel-head">
                <h2 className="sb-h3 mb-0">{content.contactTitle}</h2>
              </div>
              <div className="sb-panel-body sb-spec-list">
                <Row label={content.fields.email}>{user.email}</Row>
                <Row label={content.fields.phone}>{user.phone}</Row>
              </div>
            </section>

            <section className="sb-card sb-panel">
              <div className="sb-panel-head">
                <h2 className="sb-h3 mb-0">{content.accountTitle}</h2>
              </div>
              <div className="sb-panel-body sb-spec-list">
                <Row label={content.fields.id}>
                  <span className="sb-mono">{user.id}</span>
                </Row>
                <Row label={content.fields.username}>@{user.username}</Row>
                <Row label={content.fields.role}>{user.role}</Row>
                <Row label={content.fields.joined}>
                  {user.createdAt}
                  <span className="sb-caption d-block">
                    {formatRelative(user.createdAt)}
                  </span>
                </Row>
                <Row label={content.fields.updated}>{user.updatedAt}</Row>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

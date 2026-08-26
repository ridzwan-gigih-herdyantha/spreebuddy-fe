import { useDeferredValue, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Avatar from "@/components/ui/Avatar";
import FilterBar from "@/components/ui/FilterBar";
import { listUsers } from "@/api/admin";
import { formatRelative } from "@/utils/format";
import { adminRoutes } from "@/config/admin";
import { USERS_PAGE_SIZE, usersAdminContent } from "@/data/admin";

const PAGE_SPAN = 3;

function pageWindow(current, totalPages) {
  const end = Math.min(totalPages, Math.max(current + 1, PAGE_SPAN));
  const start = Math.max(1, end - PAGE_SPAN + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export default function AdminUsers() {
  const content = usersAdminContent;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const term = useDeferredValue(search);

  const users = useQuery({
    queryKey: ["admin", "users", page, term],
    queryFn: () => listUsers({ page, limit: USERS_PAGE_SIZE, search: term }),
    placeholderData: (previous) => previous,
    retry: false,
  });

  const items = users.data?.data ?? [];
  const meta = users.data?.meta;
  const total = meta?.total ?? items.length;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const current = Math.min(page, totalPages);
  const pages = pageWindow(current, totalPages);

  return (
    <>
      <header className="sb-admin-head">
        <div>
          <h1 className="sb-h1 mb-1">{content.title}</h1>
          <p className="sb-lead mb-0">
            {total} {term ? content.leadFiltered : content.lead}
          </p>
        </div>
      </header>

      <FilterBar
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        searchPlaceholder={content.searchPlaceholder}
        trailing={
          <span className="sb-meta">
            {items.length} of {total}
          </span>
        }
      />

      {users.isError && (
        <p className="sb-form-error" role="alert">
          <i className="bi bi-exclamation-triangle-fill" />{" "}
          {users.error.message}
        </p>
      )}

      <section className="sb-card">
        {users.isSuccess && items.length === 0 ? (
          <div className="text-center py-5">
            <h2 className="sb-h2 mb-2">{content.empty.title}</h2>
            <p className="sb-lead mb-0">{content.empty.lead}</p>
          </div>
        ) : (
          <div className="sb-table-wrap">
            <table className="sb-table">
              <thead>
                <tr>
                  <th>{content.columns.user}</th>
                  <th>{content.columns.contact}</th>
                  <th>{content.columns.location}</th>
                  <th>{content.columns.joined}</th>
                  <th className="text-end">{content.columns.actions}</th>
                </tr>
              </thead>

              <tbody>
                {items.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <Avatar name={user.name} src={user.avatarUrl} />
                        <div className="min-w-0 sb-prod-cell">
                          <Link
                            to={`${adminRoutes.users}/${user.id}`}
                            className="sb-order-name sb-prod-link text-truncate"
                            title={user.name}
                          >
                            {user.name}
                          </Link>
                          <div className="sb-caption text-truncate">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="min-w-0 sb-prod-cell">
                        <div className="text-truncate" title={user.email}>
                          {user.email}
                        </div>
                        <div className="sb-caption">{user.phone}</div>
                      </div>
                    </td>

                    <td>
                      {user.address ? (
                        <div className="min-w-0 sb-prod-cell">
                          <div className="text-truncate">
                            {user.address.city}
                          </div>
                          <div className="sb-caption text-truncate">
                            {user.address.state}
                          </div>
                        </div>
                      ) : (
                        <span className="sb-meta">{content.noAddress}</span>
                      )}
                    </td>

                    <td>
                      <div>{user.createdAt}</div>
                      <div className="sb-caption">
                        {formatRelative(user.createdAt)}
                      </div>
                    </td>

                    <td>
                      <div className="sb-row-actions">
                        <Link
                          to={`${adminRoutes.users}/${user.id}`}
                          className="sb-row-action"
                          title={content.actions.detail}
                          aria-label={`${content.actions.detail} ${user.name}`}
                        >
                          <i className="bi bi-eye" />
                        </Link>
                        <Link
                          to={`${adminRoutes.users}/${user.id}/edit`}
                          className="sb-row-action"
                          title={content.actions.edit}
                          aria-label={`${content.actions.edit} ${user.name}`}
                        >
                          <i className="bi bi-pencil" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="sb-table-foot">
          <span className="sb-meta">
            Showing {items.length} of {total} accounts
          </span>

          {totalPages > 1 && (
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="sb-page-btn"
                disabled={!meta?.hasPrevPage}
                onClick={() => setPage(current - 1)}
                aria-label="Previous page"
              >
                <i className="bi bi-chevron-left" />
              </button>

              {pages.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`sb-page-btn ${value === current ? "is-active" : ""}`}
                  aria-current={value === current ? "page" : undefined}
                  onClick={() => setPage(value)}
                >
                  {value}
                </button>
              ))}

              {pages.at(-1) < totalPages && <span className="sb-meta">…</span>}

              <button
                type="button"
                className="sb-page-btn"
                disabled={!meta?.hasNextPage}
                onClick={() => setPage(current + 1)}
                aria-label="Next page"
              >
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

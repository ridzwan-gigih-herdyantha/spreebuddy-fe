import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FilterBar from "@/components/ui/FilterBar";
import { deleteSession, listSessions } from "@/api/chat";
import { formatRelative, parseApiDate } from "@/utils/format";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { chatHistoryContent, chatHistorySortOptions } from "@/data/chatHistory";

const SESSIONS_KEY = ["sessions"];
const DELETE_MUTATION = ["sessions", "delete"];
const DAY = 86_400_000;

const bucketOf = (session) => {
  const date = parseApiDate(session.updatedAt ?? session.createdAt);
  if (!date) return "Earlier";
  const days = Math.floor((Date.now() - date.getTime()) / DAY);
  if (days <= 0) return "Today";
  if (days < 7) return "This week";
  return "Earlier";
};

const sorters = {
  oldest: (a, b) => parseApiDate(a.createdAt) - parseApiDate(b.createdAt),
  title: (a, b) => (a.title ?? "").localeCompare(b.title ?? ""),
};

export default function ChatHistory() {
  const content = chatHistoryContent;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [range, setRange] = useState(content.allRange);
  const [sort, setSort] = useState("recent");
  const [removing, setRemoving] = useState({});

  const sessions = useQuery({
    queryKey: SESSIONS_KEY,
    queryFn: listSessions,
    enabled: Boolean(user),
    retry: false,
  });

  const remove = useMutation({
    mutationKey: DELETE_MUTATION,
    mutationFn: deleteSession,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: SESSIONS_KEY });
      const previous = queryClient.getQueryData(SESSIONS_KEY);

      setRemoving((state) => ({ ...state, [id]: true }));
      queryClient.setQueryData(SESSIONS_KEY, (old) => ({
        ...old,
        data: (old?.data ?? []).filter((session) => session.id !== id),
      }));

      return { previous };
    },
    onError: (err, _id, context) => {
      if (context?.previous)
        queryClient.setQueryData(SESSIONS_KEY, context.previous);
      toast.error(err?.message ?? "Could not delete that conversation.");
    },
    onSuccess: () => toast.success("Conversation deleted."),
    onSettled: (_data, _err, id) => {
      setRemoving((state) => {
        const next = { ...state };
        delete next[id];
        return next;
      });
      if (queryClient.isMutating({ mutationKey: DELETE_MUTATION }) === 1) {
        queryClient.invalidateQueries({ queryKey: SESSIONS_KEY });
      }
    },
  });

  const items = useMemo(() => sessions.data?.data ?? [], [sessions.data]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = items.filter((session) => {
      const bucket = bucketOf(session);
      const matchesRange =
        range === content.allRange ||
        (range === "This week"
          ? bucket === "Today" || bucket === "This week"
          : bucket === range);
      const matchesTerm =
        !term || (session.title ?? "").toLowerCase().includes(term);
      return matchesRange && matchesTerm;
    });
    return sorters[sort]
      ? [...filtered].sort(sorters[sort])
      : [...filtered].sort(
          (a, b) => parseApiDate(b.createdAt) - parseApiDate(a.createdAt),
        );
  }, [items, search, range, sort, content.allRange]);

  const grouped = useMemo(
    () =>
      content.groups
        .map((name) => ({
          name,
          rows: visible.filter((session) => bucketOf(session) === name),
        }))
        .filter((group) => group.rows.length > 0),
    [visible, content.groups],
  );

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

  return (
    <section className="sb-section">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <h1 className="sb-h1 mb-1">{content.title}</h1>
          <p className="sb-lead mb-0">{content.lead}</p>
        </div>
        <Link
          to={content.newChat.to}
          className="btn btn-primary rounded-pill px-4"
        >
          <i className="bi bi-plus-lg" /> {content.newChat.label}
        </Link>
      </div>

      {items.length > 0 && (
        <FilterBar
          search={search}
          onSearch={setSearch}
          searchPlaceholder={content.searchPlaceholder}
          chips={[content.allRange, "This week", "Earlier"]}
          active={range}
          onChip={setRange}
          sort={sort}
          sortOptions={chatHistorySortOptions}
          onSort={setSort}
        />
      )}

      {sessions.isPending && (
        <div className="d-flex flex-column gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="sb-card sb-history-skeleton" />
          ))}
        </div>
      )}

      {sessions.isError && (
        <p className="sb-form-error" role="alert">
          <i className="bi bi-exclamation-triangle-fill" />{" "}
          {sessions.error.message}
        </p>
      )}

      {sessions.isSuccess && visible.length === 0 && (
        <div className="text-center py-5">
          <h2 className="sb-h2 mb-2">{content.empty.title}</h2>
          <p className="sb-lead mb-4">{content.empty.lead}</p>
          <Link
            to={content.empty.action.to}
            className="btn btn-primary rounded-pill px-4"
          >
            {content.empty.action.label}
          </Link>
        </div>
      )}

      {grouped.map(({ name, rows }) => (
        <div key={name} className="mb-4">
          <h2 className="sb-eyebrow text-uppercase mb-3">{name}</h2>

          <div className="d-flex flex-column gap-2">
            {rows.map((session) => (
              <article
                key={session.id}
                className={`sb-card sb-history-row ${removing[session.id] ? "is-removing" : ""}`}
              >
                <span className="sb-history-icon">
                  <i className="bi bi-chat-dots" />
                </span>

                <button
                  type="button"
                  className="sb-history-open"
                  onClick={() => navigate(`/chat?session=${session.id}`)}
                >
                  <span className="sb-history-title text-truncate">
                    {session.title || "Untitled conversation"}
                  </span>
                  <span className="sb-caption">
                    Updated {formatRelative(session.updatedAt)}
                  </span>
                </button>

                <button
                  type="button"
                  className="sb-history-delete"
                  aria-label={`Delete ${session.title || "conversation"}`}
                  disabled={removing[session.id]}
                  onClick={() => remove.mutate(session.id)}
                >
                  <i
                    className={`bi ${removing[session.id] ? "bi-arrow-repeat sb-spin" : "bi-trash3"}`}
                  />
                </button>
              </article>
            ))}
          </div>
        </div>
      ))}

      {visible.length > 0 && (
        <p className="sb-meta text-center mb-0">
          {visible.length} of {items.length}{" "}
          {items.length === 1 ? "conversation" : "conversations"}
        </p>
      )}
    </section>
  );
}

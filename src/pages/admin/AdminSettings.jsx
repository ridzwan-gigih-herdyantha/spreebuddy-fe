import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AvatarField from "@/components/auth/AvatarField";
import PasswordToggle from "@/components/auth/PasswordToggle";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import TextField from "@/components/ui/TextField";
import StatusPill from "@/components/ui/StatusPill";
import { getAiUsage, getHealth, updateUser } from "@/api/admin";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "@/api/categories";
import { listProducts } from "@/api/products";
import { maintenanceMode, previewPagesEnabled } from "@/config/features";
import {
  ORDERS_ADMIN_PAGE_SIZE,
  PRODUCTS_PAGE_SIZE,
  USERS_PAGE_SIZE,
  settingsContent,
} from "@/data/admin";
import { LOW_STOCK_THRESHOLD } from "@/data/shop";
import { orderStatuses, orderTransitions } from "@/data/orders";
import { useAuth } from "@/hooks/useAuth";

const CATEGORIES_KEY = ["categories"];
const COUNTS_KEY = ["admin", "category-counts"];

const formatUptime = (seconds) => {
  if (typeof seconds !== "number") return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

function Row({ label, children }) {
  return (
    <div className="sb-spec-row">
      <span className="sb-spec-label">{label}</span>
      <span className="sb-spec-value">{children}</span>
    </div>
  );
}

function AccountPanel({ content, user }) {
  const queryClient = useQueryClient();
  const [avatar, setAvatar] = useState(null);
  const [visible, setVisible] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    values: {
      name: user?.name ?? "",
      username: user?.username ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      password: "",
    },
  });

  const save = useMutation({
    mutationFn: (body) => updateUser({ id: user.id, ...body }),
    onSuccess: () => {
      setAvatar(null);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err) => {
      err.fieldErrors?.forEach(({ field, message }) => {
        if (field) setError(field, { message });
      });
    },
  });

  const formError =
    save.error && !save.error.fieldErrors?.length ? save.error.message : null;

  return (
    <section className="sb-card sb-panel">
      <div className="sb-panel-head">
        <h2 className="sb-h3 mb-0">{content.title}</h2>
        {save.isSuccess && !save.isPending && (
          <span className="sb-pill sb-pill-success">{content.saved}</span>
        )}
      </div>

      <form
        className="sb-panel-body sb-form-grid"
        onSubmit={handleSubmit((values) =>
          save.mutate({
            name: values.name.trim(),
            username: values.username.trim(),
            email: values.email.trim(),
            phone: values.phone.trim(),
            ...(values.password ? { password: values.password } : {}),
            ...(avatar ? { avatar } : {}),
          }),
        )}
        noValidate
      >
        <p className="sb-meta mb-0">{content.lead}</p>

        {formError && (
          <p className="sb-form-error mb-0" role="alert">
            <i className="bi bi-exclamation-triangle-fill" /> {formError}
          </p>
        )}

        <AvatarField
          id="admin-avatar"
          label={content.fields.avatar}
          help={content.help.avatar}
          file={avatar}
          onClear={() => setAvatar(null)}
          onChange={(event) => setAvatar(event.target.files?.[0] ?? null)}
        />

        <div className="row g-3">
          <div className="col-12 col-sm-6 col-xl-3">
            <TextField
              id="admin-name"
              label={content.fields.name}
              error={errors.name?.message}
              {...register("name", { required: "Name is required" })}
            />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <TextField
              id="admin-username"
              label={content.fields.username}
              error={errors.username?.message}
              {...register("username", { required: "Username is required" })}
            />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <TextField
              id="admin-email"
              type="email"
              label={content.fields.email}
              error={errors.email?.message}
              {...register("email", { required: "Email is required" })}
            />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <TextField
              id="admin-phone"
              label={content.fields.phone}
              help={content.help.phone}
              error={errors.phone?.message}
              {...register("phone", {
                required: "Phone is required",
                pattern: {
                  value: /^\+?\d{10,15}$/,
                  message: content.help.phone,
                },
              })}
            />
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-sm-6 col-xl-3">
            <TextField
              id="admin-password"
              type={visible ? "text" : "password"}
              label={content.fields.password}
              placeholder="••••••••"
              autoComplete="new-password"
              help={content.help.password}
              error={errors.password?.message}
              trailing={
                <PasswordToggle
                  visible={visible}
                  onToggle={() => setVisible((v) => !v)}
                />
              }
              {...register("password", {
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="btn btn-primary rounded-pill px-4"
            disabled={save.isPending || !user}
          >
            {save.isPending ? content.pending : content.submit}
          </button>
        </div>
      </form>
    </section>
  );
}

function CategoriesPanel({ content, removeCopy }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [pending, setPending] = useState(null);

  const categories = useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: listCategories,
    retry: false,
  });

  const items = categories.data?.data ?? [];

  // Products store the category by name, so usage is a real product count.
  const counts = useQuery({
    queryKey: [...COUNTS_KEY, items.map(({ id }) => id).join(",")],
    queryFn: async () => {
      const results = await Promise.all(
        items.map(({ name }) =>
          listProducts({ page: 1, limit: 1, category: name }),
        ),
      );
      return Object.fromEntries(
        items.map(({ id }, index) => [id, results[index]?.meta?.total ?? 0]),
      );
    },
    enabled: items.length > 0,
    retry: false,
  });

  const settle = () => {
    queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    queryClient.invalidateQueries({ queryKey: COUNTS_KEY });
    queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
  };

  const add = useForm({ mode: "onTouched" });

  const create = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      add.reset({ name: "", description: "" });
      settle();
    },
  });

  const rename = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      setEditing(null);
      settle();
    },
  });

  const remove = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      setPending(null);
      settle();
    },
  });

  const error = create.error ?? rename.error ?? categories.error;

  return (
    <section className="sb-card sb-panel">
      <div className="sb-panel-head">
        <h2 className="sb-h3 mb-0">{content.title}</h2>
        <span className="sb-meta">{items.length}</span>
      </div>

      <div className="sb-panel-body">
        <p className="sb-meta">{content.lead}</p>

        {error && (
          <p className="sb-form-error" role="alert">
            <i className="bi bi-exclamation-triangle-fill" /> {error.message}
          </p>
        )}

        <form
          className="d-flex flex-wrap gap-2 mb-3"
          onSubmit={add.handleSubmit((values) =>
            create.mutate({
              name: values.name.trim(),
              ...(values.description?.trim()
                ? { description: values.description.trim() }
                : {}),
            }),
          )}
        >
          <input
            className="sb-input flex-grow-1"
            placeholder={content.namePlaceholder}
            aria-label={content.namePlaceholder}
            {...add.register("name", { required: true })}
          />
          <input
            className="sb-input flex-grow-1"
            placeholder={content.descriptionPlaceholder}
            aria-label={content.descriptionPlaceholder}
            {...add.register("description")}
          />
          <button
            type="submit"
            className="btn btn-primary rounded-pill px-4 text-nowrap"
            disabled={create.isPending}
          >
            {create.isPending ? content.adding : content.add}
          </button>
        </form>
      </div>

      {items.length === 0 ? (
        <div className="sb-panel-body pt-0">
          <p className="sb-lead mb-0">{content.empty}</p>
        </div>
      ) : (
        <div className="sb-table-wrap">
          <table className="sb-table">
            <thead>
              <tr>
                <th>{content.columns.name}</th>
                <th className="text-center">{content.columns.products}</th>
                <th className="text-end">{content.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((category) => {
                const used = counts.data?.[category.id];
                const locked = used > 0;
                const isEditing = editing?.id === category.id;

                return (
                  <tr key={category.id}>
                    <td>
                      {isEditing ? (
                        <input
                          className="sb-input"
                          value={editing.name}
                          aria-label={content.rename}
                          autoFocus
                          onChange={(event) =>
                            setEditing({ ...editing, name: event.target.value })
                          }
                        />
                      ) : (
                        <>
                          <div className="sb-order-name">{category.name}</div>
                          {category.description && (
                            <div className="sb-caption">
                              {category.description}
                            </div>
                          )}
                        </>
                      )}
                    </td>

                    <td className="text-center">
                      {counts.isPending ? "…" : (used ?? 0)}
                    </td>

                    <td>
                      <div className="sb-row-actions">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              className="sb-pill sb-pill-gradient"
                              disabled={
                                rename.isPending || !editing.name.trim()
                              }
                              onClick={() =>
                                rename.mutate({
                                  id: category.id,
                                  name: editing.name.trim(),
                                })
                              }
                            >
                              {content.save}
                            </button>
                            <button
                              type="button"
                              className="sb-pill sb-pill-outline"
                              onClick={() => setEditing(null)}
                            >
                              {content.cancel}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="sb-row-action"
                              title={content.rename}
                              aria-label={`${content.rename} ${category.name}`}
                              onClick={() =>
                                setEditing({
                                  id: category.id,
                                  name: category.name,
                                })
                              }
                            >
                              <i className="bi bi-pencil" />
                            </button>
                            <button
                              type="button"
                              className="sb-row-action is-danger"
                              disabled={locked}
                              title={
                                locked
                                  ? content.lockedHint
                                  : `${content.remove} ${category.name}`
                              }
                              aria-label={`${content.remove} ${category.name}`}
                              onClick={() => {
                                remove.reset();
                                setPending(category);
                              }}
                            >
                              <i className="bi bi-trash3" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pending)}
        title={removeCopy.title}
        body={
          <>
            <strong>{pending?.name}</strong> — {removeCopy.body}
          </>
        }
        confirmLabel={removeCopy.confirm}
        cancelLabel={removeCopy.cancel}
        pending={remove.isPending}
        error={remove.error?.message}
        onConfirm={() => remove.mutate(pending.id)}
        onCancel={() => (remove.isPending ? null : setPending(null))}
      />
    </section>
  );
}

function AssistantPanel({ content }) {
  const usage = useQuery({
    queryKey: ["admin", "chat", "usage"],
    queryFn: getAiUsage,
    retry: false,
  });

  const model = usage.data?.data?.model;
  const runtime = usage.data?.data?.runtime;

  return (
    <section className="sb-card sb-panel h-100">
      <div className="sb-panel-head">
        <h2 className="sb-h3 mb-0">{content.title}</h2>
        <span className="sb-meta">{content.lead}</span>
      </div>

      <div className="sb-panel-body sb-spec-list">
        <Row label={content.fields.model}>
          <span className="sb-mono">{model?.id ?? "—"}</span>
        </Row>
        <Row label={content.fields.context}>
          {model?.contextLength
            ? `${model.contextLength.toLocaleString("id-ID")} tokens`
            : "—"}
        </Row>
        <Row label={content.fields.history}>
          {runtime ? `${runtime.historyLimit} ${content.messages}` : "—"}
        </Row>
        <Row label={content.fields.steps}>
          {runtime ? `${runtime.maxToolSteps} ${content.steps}` : "—"}
        </Row>
        <Row label={content.fields.tools}>{runtime?.tools?.length ?? "—"}</Row>
      </div>

      {runtime?.tools?.length > 0 && (
        <div className="sb-panel-body pt-0 d-flex flex-wrap gap-2">
          {runtime.tools.map((tool) => (
            <span className="sb-pill sb-mono" key={tool}>
              {tool}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

function LifecyclePanel({ content }) {
  return (
    <section className="sb-card sb-panel h-100">
      <div className="sb-panel-head">
        <h2 className="sb-h3 mb-0">{content.title}</h2>
      </div>

      <div className="sb-panel-body">
        <p className="sb-meta">{content.lead}</p>

        <ul className="sb-flow">
          {orderStatuses.map((status) => {
            const next = orderTransitions[status.toLowerCase()] ?? [];
            return (
              <li key={status}>
                <StatusPill status={status} />
                <i className="bi bi-arrow-right sb-flow-arrow" />
                {next.length === 0 ? (
                  <span className="sb-meta">{content.terminal}</span>
                ) : (
                  <span className="d-flex flex-wrap gap-2">
                    {next.map((target) => (
                      <StatusPill key={target} status={target} />
                    ))}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function RulesPanel({ content }) {
  return (
    <section className="sb-card sb-panel h-100">
      <div className="sb-panel-head">
        <h2 className="sb-h3 mb-0">{content.title}</h2>
        {/* <span className="sb-meta">{content.lead}</span> */}
      </div>

      <div className="sb-panel-body sb-spec-list">
        <Row label={content.lowStock}>
          {LOW_STOCK_THRESHOLD} {content.units}
        </Row>
        <Row label={content.productsPerPage}>
          {PRODUCTS_PAGE_SIZE} {content.rows}
        </Row>
        <Row label={content.ordersPerPage}>
          {ORDERS_ADMIN_PAGE_SIZE} {content.rows}
        </Row>
        <Row label={content.usersPerPage}>
          {USERS_PAGE_SIZE} {content.rows}
        </Row>
      </div>
    </section>
  );
}

function SystemPanel({ content }) {
  const health = useQuery({
    queryKey: ["admin", "health"],
    queryFn: getHealth,
    retry: false,
  });

  const usage = useQuery({
    queryKey: ["admin", "chat", "usage"],
    queryFn: getAiUsage,
    retry: false,
  });

  const ai = usage.data?.data?.account;
  const up = health.data?.status === "ok";

  return (
    <div className="row g-3">
      <div className="col-12 col-md-4">
        <section className="sb-card sb-panel h-100">
          <div className="sb-panel-head">
            <h2 className="sb-h3 mb-0">{content.apiTitle}</h2>
            <span
              className={`sb-status-pill ${up ? "is-delivered" : "is-cancelled"}`}
            >
              <i className="sb-status-pill-dot" />
              {up ? "Ok" : content.unreachable}
            </span>
          </div>
          <div className="sb-panel-body sb-spec-list">
            <Row label={content.fields.database}>
              {health.data?.services?.database ?? "—"}
            </Row>
            <Row label={content.fields.uptime}>
              {formatUptime(health.data?.uptime)}
            </Row>
            <Row label={content.fields.baseUrl}>
              <span className="sb-mono">
                {import.meta.env.VITE_API_BASE_URL ?? "—"}
              </span>
            </Row>
          </div>
        </section>
      </div>

      <div className="col-12 col-md-4">
        <section className="sb-card sb-panel h-100">
          <div className="sb-panel-head">
            <h2 className="sb-h3 mb-0">{content.aiTitle}</h2>
          </div>
          <div className="sb-panel-body sb-spec-list">
            <Row label={content.fields.model}>
              <span className="sb-mono">{ai?.model ?? "—"}</span>
            </Row>
            <Row label={content.fields.plan}>
              {ai?.freeTier === undefined
                ? "—"
                : ai.freeTier
                  ? "Free tier"
                  : "Credits"}
            </Row>
            <Row label={content.fields.status}>
              {ai?.reachable ? "Reachable" : content.unreachable}
            </Row>
          </div>
        </section>
      </div>

      <div className="col-12 col-md-4">
        <section className="sb-card sb-panel h-100">
          <div className="sb-panel-head">
            <h2 className="sb-h3 mb-0">{content.appTitle}</h2>
          </div>
          <div className="sb-panel-body sb-spec-list">
            <Row label={content.fields.previewPages}>
              {previewPagesEnabled ? content.on : content.off}
            </Row>
            <Row label={content.fields.maintenance}>
              {maintenanceMode ? content.on : content.off}
            </Row>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const content = settingsContent;
  const { user } = useAuth();

  return (
    <>
      <header className="sb-admin-head">
        <div>
          <h1 className="sb-h1 mb-1">{content.title}</h1>
          <p className="sb-lead mb-0">{content.lead}</p>
        </div>
      </header>

      <div className="mb-3">
        <AccountPanel content={content.account} user={user} />
      </div>

      <div className="mb-3">
        <CategoriesPanel
          content={content.categories}
          removeCopy={content.categoryDelete}
        />
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-xl-7">
          <AssistantPanel content={content.assistant} />
        </div>
        <div className="col-12 col-xl-5">
          <LifecyclePanel content={content.lifecycle} />
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-xl-3">
          <RulesPanel content={content.rules} />
        </div>
        <div className="col-12 col-xl-9">
          <SystemPanel content={content.system} />
        </div>
      </div>
    </>
  );
}
